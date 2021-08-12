import os
import stripe
import django

from backend.models import (
	User, 
	Item, 
	ItemType, 
	Order
)
from backend.settings import (
	STRIPE_SECRET_KEY
)

django.setup()
stripe.api_key = STRIPE_SECRET_KEY

users = [
	{
		"username" : "",
		"email" : "",
		"password" : "",
		"first_name" : "",
		"last_name" : "",
		"location_town" : "",
		"location_postcode" : ""
	}
]

items = [
	{'name':'handbag',
	'seller':'username',
	'bio': 'Its a lovely bag with different patterns including the favourite hazy pattern.',
	'is_featured': False,
	'shape': 'Rectangle',
	'colour':'blue',
	'tag 0':'01A',
	'tag 1':'02B',
	'tag 2':'03C',
	'tag 3':'04D',
	'tag 4':'05E'},
	{'name':'monitor',
	'seller':'                      ',
	'bio': 'Its a big screen monitor with many keys.',
	'upload_date': '                  ',
	'is_featured': False,
	'shape': 'square',
	'colour':'grey',
	'tag 0':'06F',
	'tag 1':'07G',
	'tag 2':'08H',
	'tag 3':'09I',
	'tag 4':'10J'},
	{'name':'chair',
	'seller':'                      ',
	'bio': 'Its a chair with light cushions. It can be folded.',
	'upload_date': '                  ',
	'is_featured': False,
	'shape': 'triangle',
	'colour':'pink',
	'tag 0':'11K',
	'tag 1':'12L',
	'tag 2':'13M',
	'tag 3':'14N',
	'tag 4':'15O'},
	{'name':'Printer',
	'seller':'                      ',
	'bio': 'Its a printer with many different print patterns.',
	'upload_date': '                  ',
	'is_featured': False,
	'shape': 'oval',
	'colour':'black',
	'tag 0':'16P',
	'tag 1':'17Q',
	'tag 2':'18R',
	'tag 3':'19S',
	'tag 4':'20T'},
	{'name':'Speakers',
	'seller':'                      ',
	'bio': 'Its a speaker with different sound variations.',
	'upload_date': '                  ',
	'is_featured': False,
	'shape': 'crescent',
	'colour':'white',
	'tag 0':'21U',
	'tag 1':'22V',
	'tag 2':'23W',
	'tag 3':'24X',
	'tag 4':'25Y'}]

item_type = [
	{'item':'    ',
	'quantity':'9',
	'size':'20',
	'price':'32.50',
	'available': True},
	{'item':'    ',
	'quantity':'7',
	'size':'22',
	'price':'26.40',
	'available': True},
	{'item':'    ',
	'quantity':'3',
	'size':'19',
	'price':'12',
	'available': True},
	{'item':'    ',
	'quantity':'5',
	'size':'11',
	'price':'12.39',
	'available': True},
	{'item':'    ',
	'quantity':'2',
	'size':'18',
	'price':'4.49',
	'available': True}]

order = [
	{'buyer': '       ',
		'item': '       ',
		'item_type': '      ',
		'quantity': '3',
		'total':'5',
		'purchase_date':'    ',
		'payment_successful': True,
		'shipped': False,
		'arrived': Flase,
		'shipping_tag':'99A',
		'stripe_client_secret': '123Z',
		'stripe_payment_intent_id': '001Q'},
	{'buyer': '       ',
		'item': '       ',
		'item_type': '      ',
		'quantity': '5',
		'total':'14',
		'purchase_date':'    ',
		'payment_successful': True,
		'shipped': False,
		'arrived': Flase,
		'shipping_tag':'98B',
		'stripe_client_secret': '345X',
		'stripe_payment_intent_id': '002W'},
	{'buyer': '       ',
		'item': '       ',
		'item_type': '      ',
		'quantity': '9',
		'total':'18',
		'purchase_date':'    ',
		'payment_successful': True,
		'shipped': False,
		'arrived': Flase,
		'shipping_tag':'97C',
		'stripe_client_secret': '567J',
		'stripe_payment_intent_id': '003E'},
	{'buyer': '       ',
		'item': '       ',
		'item_type': '      ',
		'quantity': '12',
		'total':'17',
		'purchase_date':'    ',
		'payment_successful': True,
		'shipped': False,
		'arrived': Flase,
		'shipping_tag':'96D',
		'stripe_client_secret': '789K',
		'stripe_payment_intent_id': '004R'},
	{'buyer': '       ',
		'item': '       ',
		'item_type': '      ',
		'quantity': '2',
		'total':'13',
		'purchase_date':'    ',
		'payment_successful': True,
		'shipped': False,
		'arrived': Flase,
		'shipping_tag':'95P',
		'stripe_client_secret': '910H',
		'stripe_payment_intent_id': '005V'}

def populate():
	for u in users :
		accountResponse = stripe.Account.create(
			type="standard",
			default_currency='GBP',
			country=pycountry.countries.get(name="United Kingdom").alpha_2,
			email=u['email'].lower()
		)

		User.objects.create_user(
			username=u['username'].lower(),
			email=u['email'].lower(),
			password=u['password'],
			first_name=u['first_name'].title(),
			last_name=u['last_name'].title(),
			location_town=u['location_town'].title(),
			location_country="United Kingdom",
			location_postcode=u['location_postcode'].upper(),
			stripe_account_id=accountResponse.id
		)

		user = User.objects.get(username=u['username'])

		user.save()

	for i in items :
		seller = User.objects.all(username=i['seller'])

# The execution actually starts here
if __name__ == '__main__':
	print('Starting Rango population script...')
	populate()
	print('Populated...')