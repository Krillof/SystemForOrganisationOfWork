from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import jsonpickle
from .models import *
from .validators import *


def default_response(message="", data=None):
    if data!=None:
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
        try:
            data = list(map(lambda t: [t.title, t.get_id()], ScienceGroup.nodes.all()))
            user_groups_ids = []
            for science_group in user.science_groups:
                user_groups_ids.append(science_group.get_id())
            data = list(filter(lambda t: t[1] not in user_groups_ids, data))
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
            science_group = db.cypher_query("MATCH (a:ScienceGroup) WHERE id(a) = " + science_group_id + " return a", resolve_objects=True)[0][0][0]
            is_make_membership_request = True
            for membership_request in science_group.membership_requests:
                if membership_request.user.single().get_id() == user.get_id():
                    is_make_membership_request = False
            if is_make_membership_request:
                science_group.make_membership_request(user)
        except Exception as ex:
            #message="Error on server"
            message = str(ex)
    except:
        message="User not logined"
    return default_response(message)

@api_view(['POST'])
def science_group_get_membership_requests(request): # +-
    message = ""
    data = None
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                user_role = user.science_groups.relationship(current_science_group).role
                if Role.Owner.value == user_role:
                    #data = list(MembershipRequest.nodes.get(science_group=current_science_group))
                    data = []
                    for membership_request in current_science_group.membership_requests:
                        if (not membership_request.is_accepted) or (not membership_request.is_aborted):
                            data.append([membership_request.get_id(), membership_request.user.single().login])
                else:
                    message="You must have to be owner"
            else:
                data = None
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def science_group_accept_membership_request(request): # +-
    message = ""
    memberhip_request_id = request.POST["memberhip_request_id"]
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                q = db.cypher_query("MATCH p=(u:User WHERE ID(u)=" + user.get_id() + ")<-[:FROM]-(:MembershipRequest)-[:TO]->(g:ScienceGroup WHERE ID(g)=" + current_science_group.get_id() + " ) RETURN p LIMIT 1",
                    resolve_objects = True) # TODO: check it on client and understand structure
                path_query = q[0][0][0]
                user.connect_and_write_role(current_science_group, Role.Employee)
            else:
                data = None
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
            science_group = db.cypher_query("MATCH (a:ScienceGroup) WHERE id(a) = " + science_group_id + " return a", resolve_objects=True)[0][0][0]
            user.set_current_science_group(science_group)
            data = science_group.title
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def science_group_check_if_entered(request): 
    message = ""
    data = None
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        current_science_group = user.current_science_group.single()
        if current_science_group:
            data = current_science_group.title
        else:
            data = ""
    except:
        message="User not logined"

    return default_response(message, data)


@api_view(['POST'])
def science_group_leave(request): # +
    message = ""
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        current_science_group = user.current_science_group.single()
        if current_science_group:
            user.current_science_group.disconnect(current_science_group)
        user.save()
    except:
        message="User not logined"
    return default_response(message)


@api_view(['POST'])
def workspace_update_mindmap(request):
    message = ""
    data = None
    token = request.POST["token"]

    try:
        user = User.nodes.get(token=token)
        current_science_group = user.current_science_group.single()
        if current_science_group:
        
            data = {
                "nodes" : [],
                "links" : [],
            }

            for global_theme in current_science_group.global_themes.all():
                data["nodes"].append(global_theme)
                for task in global_theme.tasks.all():
                    data["nodes"].append(task)
                    data["links"].append(global_theme.tasks.relationship(task))
                    for article in task.articles.all():
                        data["nodes"].append(article)
                        data["links"].append(task.articles.relationship(article))
        else:
            message="No current group"
    except Exception as ex:
        message= str(ex)
    return default_response(message, data)

@api_view(['POST'])
def workspace_create_global_theme_vertex(request):
    message = ""
    data = None
    token = request.POST["token"]
    name = request.POST["name"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                user_role = user.science_groups.relationship(current_science_group).role
                if Role.Owner.value == user_role:
                    global_theme_vertex = GlobalTheme(title=name, x=0, y=0).save()
                    current_science_group.add_global_theme(global_theme_vertex)
                else:
                    message="You must be owner"
            else:
                data = None
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def workspace_create_task_vertex(request):
    message = ""
    data = None
    token = request.POST["token"]
    name = request.POST["name"]
    parent_id = request.POST["parentId"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                user_role = user.science_groups.relationship(current_science_group).role
                if Role.Owner.value == user_role:
                    global_theme_vertex = db.cypher_query("MATCH (a:GlobalTheme) WHERE id(a) = " + parent_id + " return a", resolve_objects=True)[0][0][0]
                    task_vertex = Task(title=name, x=0, y=0).save()
                    global_theme_vertex.add_task(task_vertex)
                else:
                    message="You must be owner"
            else:
                data = None
        except Exception as ex:
            #message="Error on server"
            message=str(ex)
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def workspace_create_article_vertex(request):
    message = ""
    data = None
    token = request.POST["token"]
    name = request.POST["name"]
    parent_id = request.POST["parentId"]
    doi = request.POST["doi"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                user_role = user.science_groups.relationship(current_science_group).role
                if Role.Owner.value == user_role:
                    task_vertex = db.cypher_query("MATCH (a:Task) WHERE id(a) = " + parent_id + " return a", resolve_objects=True)[0][0][0]
                    article_vertex = Article(name=name, doi=doi, x=0, y=0).save()
                    task_vertex.add_article(article_vertex)
                else:
                    message="You must be owner"
            else:
                data = None
        except:
            message="Error on server"
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def workspace_get_article_data(request):
    message = ""
    data = None
    token = request.POST["token"]
    id = request.POST["id"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                article_vertex = db.cypher_query("MATCH (a:Article) WHERE id(a) = " + id + " return a", resolve_objects=True)[0][0][0]
                article_data = article_vertex.get_article_data()
                data = {
                   "citations": article_data.citations_number,
                    "accesses": article_data.accesses_number,
                }
            else:
                data = None
        except Exception as ex:
            #message="Error on server"
            message=str(ex)
    except:
        message="User not logined"
    return default_response(message, data)

@api_view(['POST'])
def workspace_delete_vertex(request):
    message = ""
    data = None
    token = request.POST["token"]
    workspace_type = request.POST["workspace_type"]
    id = request.POST["id"]

    try:
        user = User.nodes.get(token=token)
        try:
            current_science_group = user.current_science_group.single()
            if current_science_group:
                user_role = user.science_groups.relationship(current_science_group).role
                if Role.Owner.value == user_role:
                    nodes = get_node_and_its_children_by_type_and_id(workspace_type, id)
                    for node in nodes:
                        node.delete()
                else:
                    message="You must be owner"
            else:
                data = None
        except Exception as ex:
            #message="Error on server"
            message=str(ex)
    except:
        message="User not logined"
    return default_response(message, data)