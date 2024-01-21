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


class NodesTypes(Enum):
  GlobalTheme = "GlobalTheme"
  Task = "Task"
  Article = "Article"






### Database entities classes

class Role(Enum):
  Owner = "Owner"
  Employee = "Employee"


class ScienceGroup(StructuredNode):
  title = StringProperty()
  global_themes = RelationshipTo('GlobalTheme', 'GLOBAL_THEME', model=DatedRel, cardinality=ZeroOrMore)
  users = RelationshipTo('User', 'USER', model=RoledRel, cardinality=ZeroOrMore)
  membership_requests = RelationshipTo('MembershipRequest', 'MEMBERSHIP_REQUEST', model=RelationFlattened, cardinality=One)

  def make_membership_request(self, user):
    membership_request = MembershipRequest().save()
    membership_request.user.connect(user).save()
    rel_science_group = self.membership_requests.connect(membership_request)
    rel_membership_request = membership_request.science_group.connect(self) 
    self.save()
    user.save()
    membership_request.save()

  def add_new_user(self, user_node, role=Role.Employee):
    rel_science_group = self.users.connect(user_node)
    rel_user = user_node.science_groups.connect(self)
    rel_science_group.role = role.value
    rel_user.role = role.value
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
  user = RelationshipTo('User', 'FROM', model=DatedRel, cardinality=ZeroOrOne)
  science_group = RelationshipTo('ScienceGroup', 'TO', model=RelationFlattened, cardinality=ZeroOrOne)
  is_accepted = BooleanProperty(default=False)
  is_aborted = BooleanProperty(default=False)

  def get_id(self):
    return self.element_id

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
      "workspace_type": NodesTypes.GlobalTheme.value,
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
      "workspace_type": NodesTypes.Task.value,
      "data" : {
        "label": self.title,
      },
    } | PositionedNodeFlattened.flatten(self)



class Article(PositionedNodeFlattened):
  doi = StringProperty()
  name = StringProperty()
  citations = IntegerProperty()
  accesses = IntegerProperty()
  task = RelationshipTo('Task', 'ARTICLE_FOR', model=DatedRel, cardinality=ZeroOrMore)
  
  class ArticleData:
    def __init__(self, str):
      str_parts = str.split()
      self.citations_number = int(str_parts[0])
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
    try:
      #article_data = self.get_article_data()
      #"citations" : article_data.citations_number, 
      #"accesses" : article_data.accesses_number,

      res = {
        "id" : str(self.element_id),
        "type": "doi_node",
        "workspace_type": NodesTypes.Article.value,
        "data" : {
          "label" : self.name,
          "id" : str(self.element_id), # need for doi 
          "doi" : self.doi,
        },
        "doi" : self.doi,
      }
    except Exception as ex:
      res = {
        "error" : str(ex),
      }

    return res | PositionedNodeFlattened.flatten(self)


def get_node_and_its_children_by_type_and_id(type, id):
  ans = []
  if type == NodesTypes.GlobalTheme.value:
    global_theme = db.cypher_query("MATCH (a:"+type+") WHERE id(a) = " + id + " return a", resolve_objects=True)[0][0][0]
    ans.append(global_theme)
    for task in global_theme.tasks.all():
      ans.append(task)
      for article in task.articles.all():
        ans.append(article)
  elif type == NodesTypes.Task.value:
    task = db.cypher_query("MATCH (a:"+type+") WHERE id(a) = " + id + " return a", resolve_objects=True)[0][0][0]
    ans.append(task)
    for article in task.articles.all():
        ans.append(article)
  elif type == NodesTypes.Article.value:
    ans.append(db.cypher_query("MATCH (a:"+type+") WHERE id(a) = " + id + " return a", resolve_objects=True)[0][0][0])
  return ans

