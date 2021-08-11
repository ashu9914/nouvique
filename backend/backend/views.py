import json
import pycountry
import traceback
import stripe

from django.shortcuts import render
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from backend.models import User, Item, ItemType, Order
from backend.serializers import ItemSerializer, SellerSerializer
from backend.utils import (
	get_tokens_for_user,
	get_public_user_object,
	get_public_item_object,
	get_public_itemtype_object,
	get_private_order_object,
	calculate_application_fees,
	STATUS_CODE_2xx,
	STATUS_CODE_4xx,
	STATUS_CODE_5xx
)
from backend.settings import (
	DEPLOYMENT_LINK,
	STRIPE_SECRET_KEY,
	STRIPE_SECRET_WEBHOOK_KEY
)

stripe.api_key = STRIPE_SECRET_KEY
endpoint_secret = STRIPE_SECRET_WEBHOOK_KEY

ROLE_NAME_TO_CODE = {
	"role1" : 1,
	"role2" : 2
}

class IndexView(APIView) :
	def get(self, request):
		return render(request, 'index.html')

class TestView(APIView):
	def get(self, request):
		data = {"blah" : "foo"}
		return Response(data, status=STATUS_CODE_2xx.SUCCESS.value)

class RegisterView(APIView):
	def post(self, request) :
		try :
			req = json.loads(request.body.decode('utf-8'))
			
			accountResponse = stripe.Account.create(
				type="standard",
				default_currency='GBP',
				country=pycountry.countries.get(name=req['location_country'].title()).alpha_2,
				email=req['email'].lower(),
			)

			User.objects.create_user(
				username=req['username'].lower(), 
				email=req['email'].lower(), 
				password=req['password'], 
				first_name=req['first_name'].title(), 
				last_name=req['last_name'].title(), 
				location_town=req['location_town'].title(), 
				location_country=req['location_country'].title(), 
				location_postcode=req['location_postcode'].upper(), 
				stripe_account_id=accountResponse.id
			)

			ret_user = User.objects.get(username=req['username'])
			
			tokens = get_tokens_for_user(ret_user)

			return Response({
				"tokens" : tokens,
				"username" : ret_user.username
			}, status=STATUS_CODE_2xx.CREATED.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class LoginView(APIView):
	def post(self, request) :
		try :
			req = json.loads(request.body.decode('utf-8'))

			user = authenticate(username=req['username'], password=req['password'])

			if user :
				tokens = get_tokens_for_user(user)
				return Response({
					"tokens" : tokens,
					"username" : user.username
				}, status=STATUS_CODE_2xx.ACCEPTED.value)

			else :
				return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

class UserGetView(APIView):
	def get(self, request, username) :
		try :
			user = User.objects.get(username=username)

			return Response(get_public_user_object(user), status=STATUS_CODE_2xx.SUCCESS.value)
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserIsVerifiedView(APIView) :
	def get(self, request, username) :
		try :
			user = User.objects.get(username=username)

			return Response({"verified" : user.verified}, status=STATUS_CODE_2xx.SUCCESS.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserGetStripeOnboardingView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def get(self, request, username) :
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			user = User.objects.get(username=username)

			account_onboarding_link = stripe.AccountLink.create(
				account=user.stripe_account_id,
				refresh_url=(DEPLOYMENT_LINK + '/#/refresh_stripe_onboarding_link/' + user.username),
				return_url=(DEPLOYMENT_LINK + '/#/verify_profile/' + user.username + '/' + user.stripe_account_id),
				type='account_onboarding'
			)

			return Response({ "onboarding_link" : account_onboarding_link.url }, status=STATUS_CODE_2xx.SUCCESS.value)
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserGetStripeUpdateView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def get(self, request, username) :
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			user = User.objects.get(username=username)

			account_onboarding_link = stripe.AccountLink.create(
				account=user.stripe_account_id,
				refresh_url=(DEPLOYMENT_LINK + '/#/refresh_stripe_update_link/' + user.username),
				return_url=(DEPLOYMENT_LINK + '/#/profile/' + user.username),
				type='account_onboarding'
			)

			return Response({ "update_link" : account_onboarding_link.url }, status=STATUS_CODE_2xx.SUCCESS.value)
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserVerifyView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def get(self, request, username, account_id) :
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			user = User.objects.get(username=username)

			if user.stripe_account_id != account_id :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			retrievedAccount = stripe.Account.retrieve(account_id)
			if "error" in retrievedAccount :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)
			
			if "card_payments" not in retrievedAccount["capabilities"] or "transfers" not in retrievedAccount["capabilities"] :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			if retrievedAccount["capabilities"]["card_payments"] != "active" or retrievedAccount["capabilities"]["transfers"] != "active" :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			if "details_submitted" not in retrievedAccount or not retrievedAccount["details_submitted"] :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			if "charges_enabled" not in retrievedAccount or not retrievedAccount["charges_enabled"] :
				return Response({"verified" : False}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			user.verified = True

			user.save()

			return Response({ "verified" : True }, status=STATUS_CODE_2xx.SUCCESS.value)

		except Exception:
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class PaymentIntentView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def post(self, request) :
		try:
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			req = json.loads(request.body.decode('utf-8'))

			if req["buyer_name"] == "null" or req["buyer_name"] == "" :
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			buyer = User.objects.get(username=req["buyer_name"])

			# check that request is valid and correct
			total = 0
			seller_total = {}
			for i, req_item in enumerate(req["item_types"]) :
				try :
					# try retrieve the specified items so made-up ones aren't being asked for
					Item.objects.get(name=req_item["name"], seller=req_item["seller_name"])
					seller = User.objects.get(username=req_item["seller_name"])
					item_type = ItemType.objects.get(id=req_item["type_id"])
					
					if not seller.verified :
						print("Seller cannot sell")
						return Response({}, status=STATUS_CODE_4xx.FORBIDDEN.value)

					if not item_type.available :
						print("Item is not available")
						return Response({}, status=STATUS_CODE_4xx.GONE.value)
					
					if item_type.price != req_item["price"] :
						print("Prices are incorrect")
						print("\t", item_type.price, " != ", req_item["price"])
						return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

					if item_type.quantity < int(req_item["quantity"]) :
						print("Quantity is too great")
						print("\t", item_type.quantity, " < ", req_item["quantity"])
						return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)
					
					# remove the item_type's quantity and update availablity
					item_type.quantity = item_type.quantity - req_item["quantity"]
					item_type.available = item_type.available and (item_type.quantity > 0)

					item_type.save()

				except Exception :
					# add removed quantities back onto items
					traceback.print_exc()
					for j, err_req_item in enumerate(req["item_types"]) :
						if j >= i :
							break
						
						item_type = ItemType.objects.get(id=err_req_item["type_id"])
						
						item_type.quantity = item_type.quantity + err_req_item["quantity"]
						item_type.available = item_type.available and (item_type.quantity > 0)

						item_type.save()

					return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

				transaction_price = (req_item["price"] * req_item["quantity"])
				total += transaction_price
				
				if req_item["seller_name"] not in seller_total :
					seller_total[req_item["seller_name"]] = transaction_price
				else :
					seller_total[req_item["seller_name"]] += transaction_price

			# verify total is correct
			if total != float(req["amount"]) :
				print("Total was incorrect")
				print("\t", total, " != ", float(req["amount"]))
				# add all quantities back
				for req_item in req["item_types"] :
					item_type = ItemType.objects.get(id=req_item["type_id"])
						
					item_type.quantity = item_type.quantity + req_item["quantity"]
					item_type.available = item_type.quantity > 0

					item_type.save()

				return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

			# create PaymentIntents for all items
			payment_intent_client_secrets = []
			for req_item in req["item_types"] :
				try:
					item = Item.objects.get(name=req_item["name"], seller=req_item["seller_name"])
					item_type = ItemType.objects.get(id=req_item["type_id"])
					
					# multiply prices by 100 as stripe takes positive integers in the lowest denomination of the specified currency, i.e amounts are specified in pence
					payment_intent = stripe.PaymentIntent.create(
						amount=str(int((req_item["price"]*req_item["quantity"]) * 100)),
						currency="gbp",
						payment_method_types=["card"],
						application_fee_amount=str(calculate_application_fees(seller_total[req_item["seller_name"]], req_item["price"], req_item["quantity"]) * 100),
						transfer_data={
							'destination': seller.stripe_account_id,
						}
					)

					order = Order.objects.create(
						stripe_payment_intent_id=payment_intent.id, 
						stripe_client_secret=payment_intent.client_secret, 
						item=item,
						item_type=item_type,
						quantity=req_item["quantity"],
						buyer=buyer,
						total=int((req_item["price"]*req_item["quantity"]) * 100)
					)

					if STRIPE_SECRET_WEBHOOK_KEY == 'dev_webhook_key' :
						# By pass webhook as does not function fully correctly when running locally
						order.payment_successful = True
						order.save()

					payment_intent_client_secrets.append(payment_intent.client_secret)

				except Exception:
					print("Could not handle stripe PaymentIntent and/or order creation")
					traceback.print_exc()
					for err_req_item in req["item_types"] :
						item_type = ItemType.objects.get(id=err_req_item["type_id"])
							
						item_type.quantity = item_type.quantity + err_req_item["quantity"]
						item_type.available = item_type.quantity > 0

						item_type.save()

					return Response({}, status=STATUS_CODE_5xx.INTERNAL_SERVER_ERROR.value)
					
			
			return Response({"client_secrets": payment_intent_client_secrets}, status=STATUS_CODE_2xx.ACCEPTED.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_5xx.INTERNAL_SERVER_ERROR.value)

class UndoPaymentIntentView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def post(self, response) :
		try:
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			req = json.loads(request.body.decode('utf-8'))

			req_item = req["item_type"]

			item_type = ItemType.objects.get(id=req_item["type_id"])
							
			item_type.quantity = item_type.quantity + req_item["quantity"]
			item_type.available = item_type.quantity > 0

			item_type.save()

			buyer = User.objects.get(username=req["buyer_name"])
			order = Order.objects.get(
				stripe_client_secret=req["client_secret"],
				item_type=item_type,
				quantity=req_item["quantity"],
				buyer=buyer
			)

			order.delete()

			return Response({}, status=STATUS_CODE_2xx.ACCEPTED.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_5xx.INTERNAL_SERVER_ERROR.value)		

class StripePaymentIntentWebhookView(APIView):
	@method_decorator(csrf_exempt)
	def post(self, request):
		try:
			req = request.body
			sig_header = request.META['HTTP_STRIPE_SIGNATURE']

			try:
				event = stripe.Webhook.construct_event(
					req, sig_header, endpoint_secret
				)
			except ValueError as e:
				# Invalid payload.
				traceback.print_exc()
				return Response({}, STATUS_CODE_4xx.BAD_REQUEST.value)
			except stripe.error.SignatureVerificationError as e:
				# Invalid Signature.
				traceback.print_exc()
				return Response({}, STATUS_CODE_4xx.BAD_REQUEST.value)

			if event["type"] == "payment_intent.succeeded":
				payment_intent = event["data"]["object"]
				return handle_successful_payment_intent(payment_intent)

			return Response({}, STATUS_CODE_4xx.BAD_REQUEST.value)

		except Exception :
			traceback.print_exc()
			return Response({}, STATUS_CODE_4xx.BAD_REQUEST.value)

def handle_successful_payment_intent(payment_intent):
	try:
		order = Order.objects.get(stripe_client_secret=payment_intent.client_secret, stripe_payment_intent_id=payment_intent.id)
		order.payment_successful = True
		order.save()

		return Response({"success" : True}, STATUS_CODE_2xx.SUCCESS.value)
	
	except Exception :
		traceback.print_exc()
		return Response({}, STATUS_CODE_4xx.BAD_REQUEST.value)

class OrdersGetView(APIView) :
	permission_classes = (IsAuthenticated, )

	def get(self, request, username) :
		try:
			if request.user.username != username :
				return Response([], status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			l = []

			sold_orders = Order.objects.filter(item__seller__username=username).order_by('-purchase_date')
			for o in sold_orders :
				l.append(get_private_order_object(o))
			
			buyer = User.objects.get(username=username)
			bought_orders = Order.objects.filter(buyer=buyer).order_by('-purchase_date')
			for o in bought_orders :
				l.append(get_private_order_object(o))

			return Response(l, status=STATUS_CODE_2xx.SUCCESS.value)

		except Exception:
			traceback.print_exc()
			return Response([], STATUS_CODE_4xx.BAD_REQUEST.value)

class OrdersWithUserGetView(APIView) :
	permission_classes = (IsAuthenticated, )

	def get(self, request, seller_username, buyer_username) :
		try:
			if request.user.username != buyer_username:
				return Response([], status=STATUS_CODE_4xx.UNAUTHORIZED.value)
				
			buyer = User.objects.get(username=buyer_username)
			orders = Order.objects.filter(buyer=buyer).order_by('-purchase_date')

			l = []
			for o in orders:
				if o.item.seller.username == seller_username :
					l.append(get_private_order_object(o))

			return Response(l, status=STATUS_CODE_2xx.SUCCESS.value)

		except Exception:
			traceback.print_exc()
			return Response([], STATUS_CODE_4xx.BAD_REQUEST.value)

class OrderSpecificChangeView(APIView) :
	permission_classes = (IsAuthenticated, )
	
	def post(self, request, order_id) :
		try:
			req = json.loads(request.body.decode('utf-8'))

			order = Order.objects.get(id=order_id)

			if "shipped" in req :
				order.shipping_tag = req["shipping_tag"]

				if request.user.username != order.item.seller.username :
					return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

				if req["shipped"] and order.shipping_tag == "" :
					return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

				order.shipped = req["shipped"]
				
			else :
				if request.user.username != order.buyer.username :
					return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

				order.arrived = req["arrived"]

			order.save()

			return_order = Order.objects.get(id=order_id)

			return Response(get_private_order_object(return_order), status=STATUS_CODE_2xx.ACCEPTED.value)

		except Exception :
			traceback.print_exc()
			return Response([], status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemsGetView(APIView):
	def get(self, request, username):
		try:
			user = User.objects.get(username=username)
			items = Item.objects.filter(seller=user).order_by('-upload_date')
			l = []
			for item in items:
				l.append(get_public_item_object(item))

			return Response(l, status=STATUS_CODE_2xx.SUCCESS.value)
		except Exception :
			traceback.print_exc()
			return Response([], status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemSpecificGetView(APIView):
	def get(self, request, username, name):
		try :
			user = User.objects.get(username=username)
			item = Item.objects.get(seller=user, name=name)
			
			return Response(get_public_item_object(item), status=STATUS_CODE_2xx.SUCCESS.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemSpecificChangeView(APIView):
	permission_classes = (IsAuthenticated, )

	def put(self, request, username, name):
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			req = json.loads(request.body.decode('utf-8'))

			user = User.objects.get(username=username)
			item = Item.objects.get(seller=user, name=name)

			item.bio = req["bio"]
			item.shape = req["shape"]
			item.colour = req["colour"]
			item.tag0 = req["tag0"]
			item.tag1 = req["tag1"]
			item.tag2 = req["tag2"]
			item.tag3 = req["tag3"]
			item.tag4 = req["tag4"]

			item.save()
			
			item = Item.objects.get(seller=username, name=name)
			return Response(get_public_item_object(item), status=STATUS_CODE_2xx.ACCEPTED.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

	def post(self, request, username, name) :
		try :
			req = json.loads(request.body.decode('utf-8'))

			user = User.objects.get(username=username)
			if not Item.objects.filter(seller=user, name=name).exists() :
				item = Item.objects.create(seller=user, name=name)

				item.bio = req["bio"]
				item.shape = req["shape"]
				item.colour = req["colour"]
				item.tag0 = req["tag0"]
				item.tag1 = req["tag1"]
				item.tag2 = req["tag2"]
				item.tag3 = req["tag3"]
				item.tag4 = req["tag4"]

				item.save()

				item = Item.objects.get(seller=username, name=name)
				return Response(get_public_item_object(item), status=STATUS_CODE_2xx.ACCEPTED.value)
			else :
				return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

	def delete(self, request, username, name):
		try :
			user = User.objects.get(username=username)
			item = Item.objects.get(seller=user, name=name)
			item.delete()

			return Response({}, status=STATUS_CODE_2xx.NO_CONTENT.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemTypeGetView(APIView) :
	def get(self, request, username, name):
		try:
			user = User.objects.get(username=username)
			item = Item.objects.get(seller=user, name=name)
			itemtypes = ItemType.objects.filter(item=item).order_by('size')
			l = []
			for t in itemtypes:
				l.append(get_public_itemtype_object(t))

			return Response(l, status=STATUS_CODE_2xx.SUCCESS.value)
		except Exception :
			traceback.print_exc()
			return Response([], status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemTypeGetAvailableView(APIView) :
	def get(self, request, id) :
		try:
			itemtype = ItemType.objects.get(id=id)

			return Response({"available": itemtype.available}, status=STATUS_CODE_2xx.SUCCESS.value)
			
		except Exception :
			traceback.print_exc()
			return Response({"available": False}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemTypeSpecificChangeView(APIView) :
	permission_classes = (IsAuthenticated, )

	def put(self, request, id):
		try :
			req = json.loads(request.body.decode('utf-8'))

			itemtype = ItemType.objects.get(id=id)

			if request.user.username != itemtype.item.seller.username :
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			itemtype.quantity = req["quantity"]
			itemtype.size = req["size"]
			itemtype.price = req["price"]
			itemtype.available = req["available"] and (itemtype.quantity > 0)
			
			itemtype.save()
			
			itemtype = ItemType.objects.get(id=id)
			return Response(get_public_itemtype_object(itemtype), status=STATUS_CODE_2xx.ACCEPTED.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

	def delete(self, request, id):
		try :
			itemtype = ItemType.objects.get(id=id)
			itemtype.delete()

			return Response({}, status=STATUS_CODE_2xx.NO_CONTENT.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class ItemTypeSpecificCreateView(APIView):
	permission_classes = (IsAuthenticated, )
	
	def post(self, request, username, name) :
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			req = json.loads(request.body.decode('utf-8'))

			user = User.objects.get(username=username)
			item = Item.objects.get(seller=user, name=name)

			itemtype = ItemType.objects.create(
				item=item, 
				quantity=req["quantity"], 
				size=req["size"], 
				price=req["price"], 
				available=req["available"]
			)

			itemtype.save()

			itemtype = ItemType.objects.get(id=itemtype.id)
			return Response(get_public_itemtype_object(itemtype), status=STATUS_CODE_2xx.ACCEPTED.value)

		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserChangeView(APIView):
	permission_classes = (IsAuthenticated, )

	def put(self, request, username):
		try :
			if request.user.username != username:
				return Response({}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			req = json.loads(request.body.decode('utf-8'))

			user = User.objects.get(username=username)
			user.first_name = req["first_name"]
			user.last_name = req["last_name"]
			user.email = req["email"]
			user.location_town = req["location_town"]
			user.location_country = req["location_country"]
			user.location_postcode = req["location_postcode"]
			user.bio = req["bio"]

			user.save()
			
			user = User.objects.get(username=username)
			return Response(get_public_user_object(user), status=STATUS_CODE_2xx.ACCEPTED.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

	def delete(self, request, username):
		try :
			user = User.objects.get(username=username)
			user.delete()

			return Response({}, status=STATUS_CODE_2xx.NO_CONTENT.value)
		
		except Exception :
			traceback.print_exc()
			return Response({}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class UserListView(APIView):
	def get(self, request):
		l = User.objects.all()
		users = []
		for u in l:
			users.append(get_public_user_object(u))

		return Response(users, status=STATUS_CODE_2xx.SUCCESS.value)

# class RolesListView(APIView):
# 	def get(self, request):
# 		l = Role.objects.all()
# 		roles = []
# 		for r in l:
# 			roles.append(get_public_role_object(r))

# 		return Response(roles, status=STATUS_CODE_2xx.SUCCESS.value)


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_queryset(self):
        queryset = Item.objects.all()

        # .../get_items/?is_featured=1
        is_featured = self.request.query_params.get("is_featured")
        if is_featured == "1":
            queryset = queryset.filter(is_featured=True)
        else:
            # other filters
            f_text = self.request.query_params.get("q")
            if f_text and len(f_text) > 2:
                queryset = queryset.filter(
                    Q(name__icontains=f_text) | Q(seller__icontains=f_text)
                )

            # f_tags = self.request.query_params.get('tags')
            # if f_tags:
            #   f_tags = f_tags.split(',')
            #   for tag in f_tags:
            #   queryset = queryset.filter()

            # f_region = self.request.query_params.get('region')
            # if f_region:
            #   queryset = queryset.filter()

        return queryset


class SellerListView(generics.ListAPIView):
    queryset = User.objects.filter(is_seller=True)
    serializer_class = SellerSerializer

    def get_queryset(self):
        queryset = User.objects.filter(is_seller=True)

        # .../get_sellers/?is_featured=1
        is_featured = self.request.query_params.get("is_featured")
        if is_featured == "1":
            queryset = queryset.filter(is_featured=True)
        return queryset

  
  
