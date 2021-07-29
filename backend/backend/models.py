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
	quantity = models.IntegerField()
	size = models.CharField(max_length=32)
	price = models.FloatField()
	available = models.BooleanField(default=True)

class Order(models.Model):
	buyer_name = models.ForeignKey(User, on_delete=models.CASCADE)
	# seller_name can be accessed through item
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	item_type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
	quantity = models.IntegerField()
	purchase_date = models.DateTimeField(auto_now_add=True)
	shipped = models.BooleanField(default=False)
	arrived = models.BooleanField(default=False)
	shipping_tag = models.CharField(max_length=256)