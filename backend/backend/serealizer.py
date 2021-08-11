from rest_framework import serializers
from backend.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
			model = User
			fields = "__all__"
			

class ItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = Item
		fields = ["id", "name", "seller", "pictures"]


class SellerSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ["id", "username", "pictures"]
