import uuid

from django.db import models

class User(models.Model):
	user_name = models.CharField(max_length=200)
	uuid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)

	def __str__(self):
		return self.user_name

	def get_object(self):
		return {
			"user_name":self.user_name, 
			"uuid":self.uuid
		}


class Role(models.Model):
	role_name = models.CharField(max_length=200)
	user_uuid = models.UUIDField(primary_key=False, unique=False, default=uuid.uuid4, editable=False)
	role_id = models.IntegerField()
	uuid = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)

	def __str__(self):
		return self.role_name

	def get_object(self) :
		return {
			"role_name":self.role_name, 
			"user_uuid": self.user_uuid, 
			"role_id":self.role_id, 
			"uuid": self.uuid
		}