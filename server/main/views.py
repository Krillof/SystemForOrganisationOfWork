from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import jsonpickle
from .models import *
from .validators import *


def default_response(message="", data=None):
    if data:
        return Response(jsonpickle.encode({
            "message" : message,
            "data": data
        }))
    else:
        return Response(jsonpickle.encode({
            "message" : message,
        }))



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
def user_enter(request):
    message = ""
    data =None
    login = request.POST["login"]
    password = request.POST["password"]

    # TODO: check hashed password
    try:
        user = User.nodes.get(login=login, password=password)
        data = user.sign_in()
    except User.DoesNotExist:
        message = "Wrong password or login"

    return default_response(message, data)
    

    


@api_view(['POST'])
def user_register(request):
    message = ""
    data = None
    login = request.POST["login"]
    password = request.POST["password"]

    # TODO: use something to hash password
    try:
        validate_login(login)
        validate_password(password)
        if not User.nodes.filter(login=login):
            user = User(login=login, password=password, x=0, y=0).save()
            data = user.sign_in()
        else:
            message = "User with this login already exists"
    except ValidationError as err:
        message = err.message
    return default_response(message, data)





@api_view(['POST'])
def user_leave(request):
    message = ""
    token = request.POST["token"]
    try:
        user = User.nodes.filter(token=token)
        user.token = ""
    except Exception as ex:
        message = ex.message

    return default_response(message)





@api_view(['POST'])
def user_delete(request):
    message = ""
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        user.delete()
    except Exception as ex:
        message = str(ex)

    return default_response(message)




@api_view(['POST'])
def science_group_get_available_groups(request): # +
    message = ""
    data = None
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        # TODO : don't show groups where user already in
        try:
            data = list(map(lambda t: [t.title, t.get_id()], ScienceGroup.nodes.all()))
        except Exception as ex:
            message = str(ex)
    except Exception as ex:
        message = str(ex)

    return default_response(message, data)


@api_view(['POST'])
def science_group_send_membership_request(request): # +
    message = ""
    science_group_id = request.POST["science_group_id"] 
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        try:
            science_group = ScienceGroup.nodes.get(uid=science_group_id)
            MembershipRequest(user=user, science_group=science_group).save()
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message)

@api_view(['POST'])
def science_group_get_membership_requests(request): # +-
    message = ""
    data = None
    token = request.POST["token"]
    science_group_id = request.POST["science_group_id"]

    try:
        user = User.nodes.get(token=token)
        try:
            science_group = ScienceGroup.nodes.get(uid=science_group_id)
            user_role = user.science_groups.relationship(science_group).role
            if Role.Owner == user_role:
                # data = list(MembershipRequest.nodes.get(science_group=science_group))
                message = list(MembershipRequest.nodes.get(science_group=science_group)) # TODO: checking
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def science_group_accept_membership_request(request): # +-
    message = ""
    user_id = request.POST["user_id"]
    token = request.POST["token"]
    science_group_id = request.POST["science_group_id"]

    try:
        user = User.nodes.get(token=token)
        science_group = ScienceGroup.nodes.get(uid=science_group_id)
        try:
            q = db.cypher_query("MATCH p=(u:User WHERE ID(u)=" + user_id + ")<-[:FROM]-(:MembershipRequest)-[:TO]->(g:ScienceGroup WHERE ID(g)=" + science_group.uid + " ) RETURN p LIMIT 1",
                    resolve_objects = True) # TODO: check it on client and understand structure
            path_query = q[0][0][0]
            user.connect_and_write_role(science_group, Role.Employee)
            message = str(path_query) # Just cheking...
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message)


@api_view(['POST'])
def science_group_get_participated_groups(request): # +
    message = ""
    data = None
    token = request.POST["token"]
    
    try:
        user = User.nodes.get(token=token)
        try:
            data = list(map(lambda t: [t.title, t.get_id()], user.science_groups.all()))
        except Exception as ex:
            message=str(ex)
    except:
        message="User not logined"
    return default_response(message, data)


@api_view(['POST'])
def science_group_enter(request): # +
    message = ""
    data = None
    science_group_id = request.POST["science_group_id"]
    token = request.POST["token"]
    
    try:
        user = User.nodes.get(token=token)
        try:
            science_group = ScienceGroup.nodes.get(uid=science_group_id)
            user.current_science_group = science_group
            data = science_group.title
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def science_group_get_data(request): # +-
    message = ""
    data = None
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        science_group = ScienceGroup.nodes.get(uid=request.session["science_group_id"])
        user_role = user.science_groups.relationship(science_group).role # maybe will be used after...
        data = science_group # maybe will be different...
    except:
        message="User not logined"

    return default_response(message, data)


@api_view(['POST'])
def science_group_leave(request): # +
    message = ""
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        del request.session["science_group_id"]
    except:
        message="User not logined"
    return default_response(message)

