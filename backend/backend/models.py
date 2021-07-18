from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from datetime import date

class User(AbstractUser):
	username = models.CharField(max_length=50, unique=True, primary_key=True)
	email = models.EmailField(_('email address'))
	# email = models.EmailField(_('email address'), unique=True)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'password']
	
	def __str__(self):
		return "{}".format(self.email)