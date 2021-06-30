"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

NAMESPACE = 'api'

# str, int, slug, uuid, path variables
urlpatterns = [
    path(NAMESPACE + '/', views.method_name),
    path(NAMESPACE + '/user/<uuid:uuid>/', views.user_handling),
    path(NAMESPACE + '/users/', views.users_list),
    path(NAMESPACE + '/roles/', views.roles_list),
]
