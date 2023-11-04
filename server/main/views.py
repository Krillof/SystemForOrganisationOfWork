from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *

@api_view(['GET', 'POST'])
def api_test(request):
    #joshua = User(login="joshua", password="123").save()
    #caroline = User(login="caroline123", password="123").save()
    #sci_group = ScienceGroup(title="some sci group").save()
    #rel = sci_group.participants.connect(joshua)
    #rel.role = "Employee"
    #rel.save()
    #rel = sci_group.participants.connect(caroline)
    #rel.role = "Employee"
    #rel.save()
    #rel = joshua.science_groups.connect(sci_group)
    #rel.role = "Employee"
    #rel.save()
    #rel = caroline.science_groups.connect(sci_group)
    #rel.role = "Employee"
    #rel.save()
    #joshua.save()
    #caroline.save()
    #sci_group.save()

    obj = {"nodes":[], "links":[]}
    for u in User.nodes.all():
        obj["nodes"] += [u]
        for sc in u.science_groups.all():
            obj["links"] += [u.science_groups.relationship(sc)]
    
    for sc in ScienceGroup.nodes.all():
        obj["nodes"] += [sc]
    return Response(jsonpickle.encode(obj))
