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
		"username" : "smartashu",
		"email" : "smartashu@domain.com",
		"password" : "123asd",
		"first_name" : "smart",
		"last_name" : "ashu",
		"location_town" : "rye",
		"location_postcode" : "098890"
	},
  {
		"username" : "bullseye",
		"email" : "bullseye@domain.com",
		"password" : "234add",
		"first_name" : "bulls",
		"last_name" : "eye",
		"location_town" : "glasgow",
		"location_postcode" : "098897"
	},
  {
		"username" : "masterfive",
		"email" : "masterfive@domain.com",
		"password" : "567iop",
		"first_name" : "master",
		"last_name" : "five",
		"location_town" : "newcastle",
		"location_postcode" : "890134"
	},
  {
		"username" : "gorgeousv",
		"email" : "gorgeousv@domain.com",
		"password" : "908lmn",
		"first_name" : "gorgeous",
		"last_name" : "vee",
		"location_town" : "dumbarton",
		"location_postcode" : "501926"
	},
  {
		"username" : "smartplay",
		"email" : "smartplay@domain.com",
		"password" : "112uyt",
		"first_name" : "smart",
		"last_name" : "play",
		"location_town" : "balloch",
		"location_postcode" : "560198"
	}
]

items = [
	{
    'name':'handbag',
	  'seller':'username',
	  'bio': 'Its a lovely bag with different patterns including the favourite hazy pattern.',
	  'is_featured': False,
	  'shape': 'Rectangle',
	  'colour':'blue',
	  'tag 0':'01A',
	  'tag 1':'02B',
	  'tag 2':'03C',
	  'tag 3':'04D',
	  'tag 4':'05E'
  },
	{
    'name':'monitor',
	  'seller':'username',
	  'bio': 'Its a big screen monitor with many keys.',
	  'is_featured': False,
	  'shape': 'square',
	  'colour':'grey',
	  'tag 0':'06F',
	  'tag 1':'07G',
	  'tag 2':'08H',
	  'tag 3':'09I',
	  'tag 4':'10J'
  },
	{
    'name':'chair',
	  'seller':'username',
	  'bio': 'Its a chair with light cushions. It can be folded.',
	  'is_featured': False,
	  'shape': 'triangle',
	  'colour':'pink',
	  'tag 0':'11K',
	  'tag 1':'12L',
	  'tag 2':'13M',
	  'tag 3':'14N',
	  'tag 4':'15O'
  },
	{
    'name':'Printer',
	  'seller':'username',
	  'bio': 'Its a printer with many different print patterns.',
	  'is_featured': False,
	  'shape': 'oval',
	  'colour':'black',
	  'tag 0':'16P',
	  'tag 1':'17Q',
	  'tag 2':'18R',
	  'tag 3':'19S',
	  'tag 4':'20T'
  },
	{
    'name':'Speakers',
	  'seller':'username',
	  'bio': 'Its a speaker with different sound variations.',
	  'is_featured': False,
	  'shape': 'crescent',
	  'colour':'white',
	  'tag 0':'21U',
	  'tag 1':'22V',
	  'tag 2':'23W',
	  'tag 3':'24X',
	  'tag 4':'25Y'
  }
]

item_type = [
	{
    'item':'',
	  'quantity':'9',
	  'size':'20',
	  'price':'32.50',
	  'available': True
  },
	{
    'item':'',
	  'quantity':'7',
	  'size':'22',
	  'price':'26.40',
	  'available': True
  },
	{
    'item':'',
	  'quantity':'3',
	  'size':'19',
	  'price':'12',
	  'available': True
  },
	{
    'item':'',
	  'quantity':'5',
	  'size':'11',
	  'price':'12.39',
	  'available': True
  },
	{
    'item':'',
	  'quantity':'2',
	  'size':'18',
	  'price':'4.49',
	  'available': True
  }
]

order = [
	{
    'buyer': '',
		'item': '',
		'item_type': '',
		'quantity': '3',
		'total':'5',
		'purchase_date':'',
		'payment_successful': True,
		'shipped': False,
		'arrived': False,
		'shipping_tag':'99A',
  },
  {
    'buyer': '',
		'item': '',
		'item_type': '',
		'quantity': '5',
		'total':'14',
		'purchase_date':'',
		'payment_successful': True,
		'shipped': False,
		'arrived': False,
		'shipping_tag':'98B',
  },
  {
    'buyer': '',
		'item': '',
		'item_type': '',
		'quantity': '9',
		'total':'18',
		'purchase_date':'',
		'payment_successful': True,
		'shipped': False,
		'arrived': False,
		'shipping_tag':'97C',
  },
  {
    'buyer': '',
		'item': '',
		'item_type': '',
		'quantity': '12',
		'total':'17',
		'purchase_date':'',
		'payment_successful': True,
		'shipped': False,
		'arrived': False,
		'shipping_tag':'96D',
  },
  {
    'buyer': '',
		'item': '',
		'item_type': '',
		'quantity': '2',
		'total':'13',
		'purchase_date':'',
		'payment_successful': True,
		'shipped': False,
		'arrived': False,
		'shipping_tag':'95P',
  }
  
def populate():
    for u in users :  #for users
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

   for i in items : #for items
       seller = User.objects.all(username=i['seller'])
  
       seller.save()
  
   for t in item_types:
       item_type = ItemType.objects.get(id=req_item["type_id"])
      
   for o in orders: #for order 
       payment_intent = stripe.PaymentIntent.create(
						amount=str(int((o["price"]*o["quantity"]) * 100)),
						currency="gbp",
						payment_method_types=["card"],
						application_fee_amount=str(calculate_application_fees(seller_total[o["seller_name"]], o["price"], o["quantity"]) * 100),
						transfer_data={
							'destination': seller.stripe_account_id,
						}
        )
       order = Order.objects.create(
						stripe_payment_intent_id=payment_intent.id, 
						stripe_client_secret=payment_intent.client_secret, 
						item=item,
						item_type=item_type,
						quantity=o["quantity"],
						buyer=buyer,
						total=int((o["price"]*o["quantity"]) * 100)
       )
       if STRIPE_SECRET_WEBHOOK_KEY == 'dev_webhook_key' :
						order.payment_successful = True
						order.save()

# The execution actually starts here
if __name__ == '__main__':
	print('Starting Rango population script...')
	print('Populated...')
	populate()

