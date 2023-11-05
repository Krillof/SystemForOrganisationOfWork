from typing import Any
from neomodel import StructuredNode, StringProperty, RelationshipTo, StructuredRel, ZeroOrMore, IntegerProperty
import jsonpickle
from jsonpickle.handlers import BaseHandler, register


class JsonFlattened:
  def flatten(self):
    raise NotImplementedError()

class ParticipantRel(StructuredRel, JsonFlattened):
  role = StringProperty()

  def flatten(self):
    return {"source": str(self.start_node().element_id), "target": str(self.end_node().element_id), "role": self.role}

class User(StructuredNode, JsonFlattened):
  login = StringProperty()
  password = StringProperty()
  science_groups = RelationshipTo('ScienceGroup', 'PARTICIPANT', model=ParticipantRel, cardinality=ZeroOrMore)

  def flatten(self): 
    return {"id": str(self.element_id), "login": self.login, "password": self.password}

class ScienceGroup(StructuredNode, JsonFlattened):
  title = StringProperty()
  participants = RelationshipTo('User', 'PARTICIPANT', model=ParticipantRel, cardinality=ZeroOrMore)

  def flatten(self):
    return {"id": str(self.element_id), "title": self.title}
  

class TaskThemeRel(StructuredRel, JsonFlattened):
  def flatten(self):
    return [["id" , str(self.element_id)], ["source",str(self.start_node().element_id)], ["target", str(self.end_node().element_id)]]


class Task(StructuredNode, JsonFlattened):
  title = StringProperty()
  x = IntegerProperty()
  y = IntegerProperty()

  def flatten(self):
    return [["id", str(self.element_id)],["data",[["label", self.title]] ] , ["position",[["x",self.x], ["y",self.y]]]]


class GlobalTheme(StructuredNode, JsonFlattened):
  title = StringProperty()
  x = IntegerProperty()
  y = IntegerProperty()
  tasks = RelationshipTo('Task', 'TASK', model=TaskThemeRel, cardinality=ZeroOrMore)


  def flatten(self):
    return [["id", str(self.element_id)],["data",[["label", self.title]] ] , ["position",[["x",self.x], ["y",self.y]]]]


@register(ParticipantRel, base=True)
@register(User, base=True)
@register(ScienceGroup, base=True)
@register(TaskThemeRel, base=True)
@register(Task, base=True)
@register(GlobalTheme, base=True)
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
