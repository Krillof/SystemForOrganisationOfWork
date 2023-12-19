from typing import Any
from neomodel import *
from jsonpickle.handlers import BaseHandler, register
from datetime import date
from enum import Enum
import subprocess
import random
import string


### Classes for jsonification

class JsonFlattened:
  def flatten(self):
    return {}
  

@register(JsonFlattened, base=True)
class ComplexObjectToJsonHandler(BaseHandler):
  def flatten(self, obj, data):
    if isinstance(obj, JsonFlattened):
      data = obj.flatten()
    else:
      raise NotImplementedError(type(obj))
    return data
  
  def restore(self, data):
    obj = [] # TODO: restore object from Json
    return []










### Classes, that will be parents for classes below them

class RelationFlattened(StructuredRel, JsonFlattened):
  def flatten(self):
    return {
      "id":str(self.element_id),
      "source":str(self.start_node().element_id),
      "target": str(self.end_node().element_id),
    }
  
class DatedRel(RelationFlattened):
  created_date = DateProperty()

  def flatten(self):
    return {
      "created_date": str(self.created_date),
    } | super().flatten()

class RoledRel(RelationFlattened):
  role = StringProperty()

  def flatten(self):
    return {
      "role": self.role,
    } | super().flatten()

class NodeFlattened(StructuredNode, JsonFlattened):
  def flatten(self):
    return {
      "id" : str(self.element_id)
    } | super().flatten()

class PositionedNodeFlattened(NodeFlattened):
  x = IntegerProperty()
  y = IntegerProperty()

  def flatten(self):
    return {
      "position": {
          "x": self.x,
          "y": self.y,
      }
    } | super().flatten()





### Database entities classes

class Role(Enum):
  Owner = "Owner"
  Employee = "Employee"


class ScienceGroup(StructuredNode):
  title = StringProperty()
  global_themes = RelationshipTo('GlobalTheme', 'GLOBAL_THEME', model=DatedRel, cardinality=ZeroOrMore)
  users = RelationshipTo('User', 'USER', model=RoledRel, cardinality=ZeroOrMore)

  def add_new_user(self, user_node, role=Role.Employee):
    rel_science_group = self.users.connect(user_node)
    rel_user = user_node.science_groups.connect(self)
    rel_science_group.role = role
    rel_user.role = role
    self.save()
    user_node.save()
    rel_science_group.save()
    rel_user.save()
    
  def add_global_theme(self, global_theme_node):
    rel_science_group = self.global_themes.connect(global_theme_node)
    rel_global_theme = global_theme_node.science_group.connect(self)
    rel_science_group.created_date = date.today()
    rel_global_theme.created_date = date.today()
    self.save()
    global_theme_node.save()
    rel_science_group.save()
    rel_global_theme.save()

  def get_id(self):
    return self.element_id


class User(StructuredNode):
  login = StringProperty()
  password = StringProperty()
  token = StringProperty()
  science_groups = RelationshipTo('ScienceGroup', 'PARTICIPANT', model=RoledRel, cardinality=ZeroOrMore)
  current_science_group = RelationshipTo('ScienceGroup', 'CURRENTLY_IN', model=RoledRel, cardinality=ZeroOrOne)

  def set_current_science_group(self, science_group_node):
    rel = self.current_science_group.connect(science_group_node)
    self.save()
    science_group_node.save()
    rel.save()

  def sign_in(self):
    token = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(30))
    self.token = token
    self.save()
    return token

  def sign_out(self):
    self.token = ''
    self.save()

  def get_id(self):
    return self.element_id

  

class MembershipRequest(StructuredNode):
  user = RelationshipTo('User', 'FROM', model=DatedRel, cardinality=One)
  science_group = RelationshipTo('ScienceGroup', 'TO', model=RelationFlattened, cardinality=One)
  is_accepted = BooleanProperty(default=False)
  is_aborted = BooleanProperty(default=False)

class GlobalTheme(PositionedNodeFlattened):
  title = StringProperty()
  science_group = RelationshipTo('ScienceGroup', 'GLOBAL_THEME', model=DatedRel, cardinality=ZeroOrOne)
  tasks = RelationshipTo('Task', 'TASK', model=DatedRel, cardinality=ZeroOrMore)
  
  def add_task(self, task_node):
    rel_global_theme = self.tasks.connect(task_node)
    rel_task = task_node.global_theme.connect(self)
    rel_global_theme.created_date = date.today()
    rel_task.created_date = date.today()
    self.save()
    task_node.save()
    rel_task.save()
    rel_global_theme.save()

  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "label": self.title,
      },
    } | PositionedNodeFlattened.flatten(self)

class Task(PositionedNodeFlattened):
  title = StringProperty()
  global_theme = RelationshipTo('GlobalTheme', 'TASK', model=DatedRel, cardinality=ZeroOrMore)
  articles = RelationshipTo('Article', 'ARTICLE', model=DatedRel, cardinality=ZeroOrMore)

  def add_article(self, article_node):
    rel_article_node = article_node.task.connect(self)
    rel_task = self.articles.connect(article_node)
    rel_article_node.created_date = date.today()
    rel_task.created_date = date.today()
    self.save()
    article_node.save()
    rel_task.save()
    rel_article_node.save()
  
  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "label": self.title,
      },
    } | PositionedNodeFlattened.flatten(self)



class Article(PositionedNodeFlattened):
  doi = StringProperty()
  citations = IntegerProperty()
  accesses = IntegerProperty()
  task = RelationshipTo('Task', 'ARTICLE_FOR', model=DatedRel, cardinality=ZeroOrMore)
  
  class ArticleData:
    def __init__(self, str):
      str_parts = str.split()
      self.ciations_number = int(str_parts[0])
      self.accesses_number = int(str_parts[1])

  def get_article_data(self):
    data = None
    with subprocess.Popen(["python", "./article_reader.py", self.doi],stdout=subprocess.PIPE) as res:
      stdout = res.stdout.readline()
      if stdout =="":
        raise Exception("Problem with article reader: " + res.stderr.readline())
      data = Article.ArticleData(stdout)
    return data

  
  def flatten(self):

    res = {
      "id" : str(self.element_id),
      "data" : {
        "label" : self.doi,
      },
      "doi" : self.doi,
    }

    try:
      # TODO: Переделать, чтобы запросы были реже
      # data = self.get_article_data()
      # res += [["citations", data.ciations_number]]
      # res += [["accesses", data.accesses_number]]

      res = res | {
        "citations" : 1, 
        "accesses" : 20,
      }
    except Exception as ex:
      res = res | {
        "error" : str(ex),
      }

    return res | PositionedNodeFlattened.flatten(self)
