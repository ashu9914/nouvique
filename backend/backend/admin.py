from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
from backend.models import User, Item

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

admin.site.register(User, UserAdmin)
admin.site.register(Item, ItemAdmin)