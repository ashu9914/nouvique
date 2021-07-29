from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
from backend.models import User, Item, ItemType, Order

class UserAdmin(BaseUserAdmin):
	form = UserChangeForm
	fieldsets = (
		(None, {'fields': ('username', 'email', 'password', 'first_name', 'last_name')}),
		(_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		(_('Important dates'), {'fields': ('last_login', 'date_joined')}),
		# (_('user_info'), {'fields': ('native_name', 'phone_no')}),
	)
	add_fieldsets = (
		(None, {'classes': ('wide', ), 'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name'), }),
	)
	list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
	search_fields = ('username', 'email', 'first_name', 'last_name')
	ordering = ('username', )

class ItemAdmin(admin.ModelAdmin):
	fields = ('name', 'seller', 'bio', 'colour', 'shape', 'tag0', 'tag1', 'tag2', 'tag3', 'tag4')
	ordering = ('name', 'seller')

class ItemTypeAdmin(admin.ModelAdmin):
	fields = ('item', 'quantity', 'size', 'price')
	ordering = ('item', 'size')

class OrderAdmin(admin.ModelAdmin):
	fields = ('buyer_name', 'item', 'item_type', 'quantity', 'purchase_date', 'shipped', 'arrived', 'shipping_tag')
	ordering = ('purchase_date', 'buyer_name')

admin.site.register(User, UserAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(ItemType, ItemTypeAdmin)
admin.site.register(Order, OrderAdmin)