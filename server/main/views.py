from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *

@api_view(['GET', 'POST'])
def api_test(request):
    
    obj = {"nodes":[], "links":[]}
    for u in GlobalTheme.nodes.all():
        obj["nodes"] += [u]
        for sc in u.tasks.all():
            obj["links"] += [u.tasks.relationship(sc)]
    
    for u in Task.nodes.all():
        obj["nodes"] += [u]
    
    return Response(jsonpickle.encode(obj))
