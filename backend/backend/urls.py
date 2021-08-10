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
from rest_framework_simplejwt.views import TokenRefreshView

NAMESPACE = 'api'

# str, int, slug, uuid, path variables
urlpatterns = [
	path('', views.IndexView.as_view()),

	path(NAMESPACE + '/admin/', admin.site.urls),

	path(NAMESPACE + '/', views.TestView.as_view()),
	
	path(NAMESPACE + '/auth/login/', views.LoginView.as_view()),
	path(NAMESPACE + '/auth/register/', views.RegisterView.as_view()),
	path(NAMESPACE + '/auth/refresh_tokens/', TokenRefreshView.as_view()),

	path(NAMESPACE + '/get_user/<str:username>/', views.UserGetView.as_view()),
	path(NAMESPACE + '/get_user_stripe_onboarding_link/<str:username>/', views.UserGetStripeOnboardingView.as_view()),
	path(NAMESPACE + '/get_user_stripe_update_link/<str:username>/', views.UserGetStripeUpdateView.as_view()),
	path(NAMESPACE + '/verify_user/<str:username>/<str:account_id>/', views.UserVerifyView.as_view()),
	path(NAMESPACE + '/is_user_verified/<str:username>/', views.UserIsVerifiedView.as_view()),
	path(NAMESPACE + '/user/<str:username>/', views.UserChangeView.as_view()),
	path(NAMESPACE + '/users/', views.UserListView.as_view()),

	path(NAMESPACE + '/get_items/<str:username>/', views.ItemsGetView.as_view()),
	path(NAMESPACE + '/get_items/<str:username>/<str:name>/', views.ItemSpecificGetView.as_view()),
	path(NAMESPACE + '/items/<str:username>/<str:name>/', views.ItemSpecificChangeView.as_view()),

	path(NAMESPACE + '/get_item_types/<str:username>/<str:name>/', views.ItemTypeGetView.as_view()),
	path(NAMESPACE + '/item_type_is_available/<int:id>/', views.ItemTypeGetAvailableView.as_view()),
	path(NAMESPACE + '/item_types/<str:username>/<str:name>/', views.ItemTypeSpecificCreateView.as_view()),
	path(NAMESPACE + '/item_types/<int:id>/', views.ItemTypeSpecificChangeView.as_view()),

	path(NAMESPACE + '/payment_intents/', views.PaymentIntentView.as_view()),
	path(NAMESPACE + '/undo_payment_intent/', views.UndoPaymentIntentView.as_view()),

	path(NAMESPACE + '/get_orders/<str:username>/', views.OrdersGetView.as_view()),
	path(NAMESPACE + '/get_orders/<str:seller_username>/<str:buyer_username>/', views.OrdersWithUserGetView.as_view()),
	path(NAMESPACE + '/order/<int:order_id>/', views.OrderSpecificChangeView.as_view()),

	path(NAMESPACE + '/stripe_webhook/', views.StripePaymentIntentWebhookView.as_view()),
] # + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
