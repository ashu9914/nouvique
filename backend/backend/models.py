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
	upload_date = models.DateField(auto_now_add=True)
	# pictures : Set of strings/static stubs
	
	class ItemShape(models.TextChoices):
		SHIRT = 'shirt'
		JEWELERY = 'jewelery'
		SKIRT = 'skirt'

	shape = models.CharField(max_length=32, choices=ItemShape.choices)

	class ItemColour(models.TextChoices):
		YELLOW = 'yellow'
		SILVER = 'silver'
		BLACK = 'black'

	colour = models.CharField(max_length=32, choices=ItemColour.choices)

	class ItemTag(models.TextChoices):
		KITSCH = 'kitsch'
		MODERN = 'modern'
		PASTEL = 'pastel'
		VIBEY = 'vibey'
		DEADSTOCK = 'deadstock'

	tag0 = models.CharField(max_length=32, choices=ItemTag.choices)
	tag1 = models.CharField(max_length=32, choices=ItemTag.choices)
	tag2 = models.CharField(max_length=32, choices=ItemTag.choices)
	tag3 = models.CharField(max_length=32, choices=ItemTag.choices)
	tag4 = models.CharField(max_length=32, choices=ItemTag.choices)
