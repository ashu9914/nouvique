from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from datetime import datetime, date

class User(AbstractUser):
	username = models.CharField(max_length=128, unique=True, primary_key=True, db_index=True)
	email = models.EmailField(_('email address'))
	location_town = models.CharField(max_length=128, default="")
	location_country = models.CharField(max_length=64, default="")
	location_postcode = models.CharField(max_length=8, default="")
	# profile_picture : static stub
	bio = models.CharField(max_length=256, default="")
	verified = models.BooleanField(default=False)
	stripe_account_id = models.CharField(max_length=128, default='')

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'password', 'location_town', 'location_country', 'location_postcode']
	
	def __str__(self):
		return "{}".format(self.email)

class Item(models.Model):
	name = models.CharField(max_length=256)
	seller = models.ForeignKey(User, on_delete=models.CASCADE)
	bio = models.CharField(max_length=256)
	upload_date = models.DateTimeField(auto_now_add=True)
	# pictures : Set of strings/static stubs
	shape = models.CharField(max_length=32)
	colour = models.CharField(max_length=32)

	tag0 = models.CharField(max_length=32)
	tag1 = models.CharField(max_length=32)
	tag2 = models.CharField(max_length=32)
	tag3 = models.CharField(max_length=32)
	tag4 = models.CharField(max_length=32)

class ItemType(models.Model):
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	quantity = models.IntegerField() # should be private as used to track available quantity
	size = models.CharField(max_length=32)
	price = models.FloatField()
	available = models.BooleanField(default=True)

class Order(models.Model):
	buyer = models.ForeignKey(User, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	item_type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
	quantity = models.IntegerField() # public and represents how many a user has bought
	total = models.IntegerField()
	purchase_date = models.DateTimeField(auto_now_add=True)
	payment_successful = models.BooleanField(default=False)
	shipped = models.BooleanField(default=False)
	arrived = models.BooleanField(default=False)
	shipping_tag = models.CharField(max_length=256, default="")
	stripe_client_secret = models.CharField(max_length=128)
	stripe_payment_intent_id = models.CharField(max_length=128) # can be used to access all the payment_intent information so the whole object does not have to be saved