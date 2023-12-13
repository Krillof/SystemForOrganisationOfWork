from typing import Any
from neomodel import *
from jsonpickle.handlers import BaseHandler, register
import datetime
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

class NodeWithDatedRel(StructuredNode):
  
  def get_dated_relationship(self):
    raise NotImplementedError()

  def connect_and_write_creation_date(self, node):
    rel = self.get_dated_relationship().connect(node)
    rel.created_date = datetime.date.today()
    self.save()
    node.save()
    return rel.save()


class Role(Enum):
  Owner = "Owner"
  Employee = "Employee"


class NodeWithRoledRel(StructuredNode):
  
  def get_roled_relationship(self):
    raise NotImplementedError()

  def connect_and_write_role(self, node, role):
    rel = self.get_roled_relationship().connect(node)
    rel.role = role.value
    self.save()
    node.save()
    return rel.save()











### Connection classes


class ParticipantRel(RoledRel):
  pass

class GlobalThemeScienceGroupRel(DatedRel):
  pass

class TaskGlobalThemeRel(DatedRel):
  pass

class ArticleTaskRel(DatedRel):
  pass







### Database entities classes


class ScienceGroup(PositionedNodeFlattened):
  title = StringProperty()

  def get_id(self):
    return self.element_id

  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "label": self.title,
      },
      "title" : self.title,
    } | super().flatten()


class User(NodeWithRoledRel, PositionedNodeFlattened):
  login = StringProperty()
  password = StringProperty()
  token = StringProperty()
  science_groups = RelationshipTo('ScienceGroup', 'PARTICIPANT', model=ParticipantRel, cardinality=ZeroOrMore)
  current_science_group = RelationshipTo('ScienceGroup', 'CURRENTLY_IN', model=ParticipantRel, cardinality=ZeroOrOne)

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

  def get_roled_relationship(self):
    return self.science_groups

  def flatten(self): 
    return {
      "id" : str(self.element_id),
      "data" : {
        "label" : self.login,
      },
      "login" : self.login,
      "password" : self.password
    } | PositionedNodeFlattened.flatten(self)
  

class MembershipRequest(NodeWithDatedRel):
  user = RelationshipTo('User', 'FROM', model=DatedRel, cardinality=One)
  science_group = RelationshipTo('ScienceGroup', 'TO', model=RelationFlattened, cardinality=One)
  is_accepted = BooleanProperty(default=False)
  is_aborted = BooleanProperty(default=False)

  def get_dated_relationship(self):
    return self.user
  
  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "is_accepted" : self.is_accepted,
        "is_aborted" : self.is_aborted,
      },
    } | PositionedNodeFlattened.flatten(self)

class GlobalTheme(NodeWithDatedRel, PositionedNodeFlattened):
  title = StringProperty()
  science_group = RelationshipTo('ScienceGroup', 'GLOBAL_THEME', model=GlobalThemeScienceGroupRel, cardinality=ZeroOrOne)

  def get_dated_relationship(self):
    return self.science_group
  
  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "label", self.title,
      },
    } | PositionedNodeFlattened.flatten(self)

class Task(NodeWithDatedRel, PositionedNodeFlattened):
  title = StringProperty()
  global_theme = RelationshipTo('GlobalTheme', 'TASK', model=TaskGlobalThemeRel, cardinality=ZeroOrMore)

  def get_dated_relationship(self):
    return self.global_theme
  
  def flatten(self):
    return {
      "id" : str(self.element_id),
      "data" : {
        "label": self.title,
      },
    } | PositionedNodeFlattened.flatten(self)



class Article(NodeWithDatedRel, PositionedNodeFlattened):
  doi = StringProperty()
  citations = IntegerProperty()
  accesses = IntegerProperty()
  tasks = RelationshipTo('Task', 'ARTICLE_FOR', model=ArticleTaskRel, cardinality=ZeroOrMore)

  def get_dated_relationship(self):
    return self.tasks
  
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
