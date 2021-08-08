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
	GONE = 410

class STATUS_CODE_5xx(enum.Enum) :
	INTERNAL_SERVER_ERROR = 500

def calculate_application_fees(seller_total, item_price, item_quantity):
	transaction_price = item_price * item_quantity
	
	# take 2.5% if seller is overall gaining £100.
	# take £2.50 if seller is gaining between £100 and £2.50
	# take 50% of the transaction price if the price is less than £2.50

	application_fees = 0

	if seller_total > 100 :
		application_fees = transaction_price * 0.025
	else :
		if transaction_price > 2.5 :
			application_fees = 2.5
		else :
			application_fees = transaction_price / 2

	return int(application_fees)

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
		"bio" : user.bio,
		"verified" : user.verified
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

def get_private_order_object(order) :
	return {
		"item" : order.item.name,
		"item_type" : order.item_type.id,
		"quantity": order.quantity,
		"purchase_date": order.purchase_date,
		"payment_successful": order.payment_successful,
		"shipped": order.shipped,
		"arrived": order.arrived,
		"shipping_tag" : order.shipping_tag
	}