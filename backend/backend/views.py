import json

from django.core import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from backend.models import User, Role

STATUS_CODE_SUCCESS = 200
STATUS_CODE_SUCCESS_ISH = 202
STATUS_CODE_COULD_NOT_FIND = 404

ROLE_NAME_TO_CODE = {
    "role1" : 1,
    "role2" : 2
}

@api_view(['GET']) # POST, PUT and DELETE
def method_name(request):
    if request.method == 'GET':
        data = {"blah" : "foo"}

        return Response(data, status=200)

@api_view(['GET', 'POST', 'PUT', 'DELETE']) # POST, PUT and DELETE
def user_handling(request, uuid):
    if request.method == 'GET':
        try :
            user = User.objects.get(pk=uuid)

            return Response(user.get_object(), status=STATUS_CODE_SUCCESS)
        except :
            return Response({}, status=STATUS_CODE_COULD_NOT_FIND)

    elif request.method == 'POST':
        try :
            req = json.loads(request.body.decode('utf-8'))

            user = User()
            user.uuid = uuid
            user.user_name = req["user_name"]

            roles = []
            for r in req["roles"] :
                role = Role()

                role.role_name = r["role_name"]
                role.role_id = ROLE_NAME_TO_CODE.get(role.role_name, -1)
                role.user_uuid = uuid

                roles.append(r)

            # append data to db last as otherwise invalid/incomplete data may be saved
            user.save()
            for r in roles :
                role.save()

            user = User.objects.get(pk=uuid)
            return Response(user.get_object(), status=STATUS_CODE_SUCCESS)
        
        except :
            try :
                user = User.objects.get(pk=uuid)
                return Response(user.get_object(), status=STATUS_CODE_SUCCESS_ISH)
            
            except :
                return Response({}, status=STATUS_CODE_COULD_NOT_FIND)

    elif request.method == 'PUT':
        try :
            req = json.loads(request.body.decode('utf-8'))

            user = User.objects.get(pk=uuid)
            user.user_name = req["user_name"]

            user.save()
            
            user = User.objects.get(pk=uuid)
            return Response(user.get_object(), status=STATUS_CODE_SUCCESS)
        
        except :
            try :
                user = User.objects.get(pk=uuid)
                return Response(user.get_object(), status=STATUS_CODE_SUCCESS_ISH)
            
            except :
                return Response({}, status=STATUS_CODE_COULD_NOT_FIND)

    elif request.method == 'DELETE':
        try :
            user = User.objects.get(pk=uuid)
            user.delete()

            return Response({}, status=STATUS_CODE_SUCCESS)
        
        except :
            try:
                user = User.objects.get(pk=uuid)
                return Response(user.get_object(), status=STATUS_CODE_COULD_NOT_FIND)
            
            except:
                return Response({}, status=STATUS_CODE_COULD_NOT_FIND)

    else :
        return Response({}, status=STATUS_CODE_COULD_NOT_FIND)

@api_view(['GET'])
def users_list(request) :
    l = User.objects.all()
    users = []
    for u in l:
        users.append(u.get_object())

    return Response(users, status=STATUS_CODE_SUCCESS)

@api_view(['GET'])
def roles_list(request) :
    l = Role.objects.all()
    roles = []
    for r in l:
        roles.append(r.get_object())

    return Response(roles, status=STATUS_CODE_SUCCESS)