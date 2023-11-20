from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *

@api_view(['GET', 'POST'])
def api_test(request):
    
    obj = {"nodes":[], "links":[]}

    
    for u in ScienceGroup.nodes.all():
        obj["nodes"] += [u]
    
    for u in User.nodes.all():
        obj["nodes"] += [u]
        for t in u.science_groups.all():
            obj["links"] += [u.science_groups.relationship(t)]

    for u in GlobalTheme.nodes.all():
        obj["nodes"] += [u]
        for t in u.science_group.all():
            obj["links"] += [u.science_group.relationship(t)]
    
    for u in Task.nodes.all():
        obj["nodes"] += [u]
        for t in u.global_theme.all():
            obj["links"] += [u.global_theme.relationship(t)]
    
    for u in Article.nodes.all():
        obj["nodes"] += [u]
        for t in u.tasks.all():
            obj["links"] += [u.tasks.relationship(t)]
    
    
    return Response(jsonpickle.encode(obj))


@api_view(['POST'])
def enter(request):
    message = ""
    login = request.POST.login
    password = request.POST.password

    # TODO: check login, password, and, especially, use something to hash password

    return Response(jsonpickle.encode({
        "message" : message
    }))


@api_view(['POST'])
def register(request):
    message = ""

    return Response(jsonpickle.encode({
        "message" : message
    }))