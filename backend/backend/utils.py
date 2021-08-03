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
		"location_town" : user.location_town,
		"location_country" : user.location_country,
		"location_postcode" : user.location_postcode,
		"bio" : user.bio
	}

def get_public_item_object(item) :
	return {
		"name" : item.name,
		"bio" : item.bio,
		"seller_name" : item.seller.username,
		"upload_date" : item.upload_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
		"shape" : item.shape,
		"colour" : item.colour,
		"tag0" : item.tag0,
		"tag1" : item.tag1,
		"tag2" : item.tag2,
		"tag3" : item.tag3,
		"tag4" : item.tag4
	}

def get_public_itemtype_object(itemtype) :
	return {
		"id" : itemtype.id,
		"item" : itemtype.item.name,
		"quantity" : itemtype.quantity,
		"size" : itemtype.size,
		"price" : itemtype.price,
		"available" : itemtype.available
	}