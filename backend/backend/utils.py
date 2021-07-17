import enum

from rest_framework_simplejwt.tokens import RefreshToken
  
class STATUS_CODE_2xx(enum.Enum):
	SUCCESS = 200
	CREATED = 201
	ACCEPTED = 202
	NO_CONTENT = 204

class STATUS_CODE_4xx(enum.Enum):
	BAD_REQUEST = 400
	UNAUTHORIZED = 401
	FORBIDDEN = 403
	NOT_FOUND = 404

def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)

	return {
		'refresh' : str(refresh),
		'access' : str(refresh.access_token)
	}

def get_public_user_object(user) :
	return {
		"email" : user.email,
		"first_name" : user.first_name,
		"last_name" : user.last_name,
	}

def get_public_role_object(role) :
	return {
		"role_name":role.role_name, 
		"user_name": role.user.username, 
		"role_id":role.role_id
	}