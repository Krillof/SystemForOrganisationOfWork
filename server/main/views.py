from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import jsonpickle
from .models import *
from .validators import *

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
    login = request.POST["login"]
    password = request.POST["password"]

    # TODO: check hashed password
    try:
        User.nodes.get(login=login, password=password)
    except User.DoesNotExist:
        message = "Wrong password or login"

    return Response(jsonpickle.encode({
        "message" : message
    }))
    

    


@api_view(['POST'])
def register(request):
    message = ""
    login = request.POST["login"]
    password = request.POST["password"]

    # TODO: use something to hash password
    try:
        validate_login(login)
        validate_password(password)
        if not User.nodes.filter(login=login):
            User(login=login, password=password, x=0, y=0).save()
        else:
            message = "User with this login already exists"
    except ValidationError as err:
        message = str(err)
    return Response(jsonpickle.encode({
        "message" : message
    }))