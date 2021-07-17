import uuid

from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
	role_name = models.CharField(max_length=200)
	user = models.ForeignKey(User, default="none", verbose_name="User", on_delete=models.SET_DEFAULT)
	role_id = models.IntegerField(primary_key=True)

	def __str__(self):
		return self.role_name