import axios, { AxiosResponse } from 'axios';
import { ok, err, Result } from 'neverthrow';
import { Stripe } from '@stripe/stripe-js';

import config from './config';

export const apiTestLink: string = '/';
export interface ApiTest {
	blah: string
}

interface AuthenticationHeaders {
	headers: {
		Authorization: string
	}
}

export interface AlertBarUpdater {
	show: boolean,
	message: string,
	variant: string
}

export interface PageProps {
	updateAlertBar: (message: string, variant: string, show: boolean) => Promise<void>,
	emptyBasket: () => void,
	addToBasket: (item: ItemREST, itemType: ItemTypeREST) => void,
	removeFromBasket: (index: number) => void,
	getBasketItems: () => BasketItem[],
	checkBasketAvailabilities: () => Promise<void>,
	getTotalBasketPrice: () => number,
	stripePromise: Promise<Stripe | null>,
	alert: AlertBarUpdater, // only added as App.tsx's state is destructed and this is included as it is a psuedo-global set of value so that the alertbar can be shared across multiple pages
}

export interface Tokens {
	access: string,
	refresh: string
}

export interface LStorage {
	tokens: Tokens,
	username: string
}

export const registrationRESTLink: string = '/auth/register/';
export const loginRESTLink: string = '/auth/login/';
export interface TokenREST {
	username: string,
	tokens: Tokens
}

export const userRESTLink: string = '/get_user/';
export interface UserREST {
	first_name: string,
	last_name: string,
	email: string,
	location_town: string,
	location_country: string,
	location_postcode: string,
	bio: string,
	verified: boolean
}
export type UserRESTKeys = "email" | "first_name" | "last_name" | "location_town" | "location_country" | "location_postcode" | "bio";

export interface RegistrationRESTSubmit {
	username: string,
	password: string,
	first_name: string,
	last_name: string,
	email: string,
	location_town: string,
	location_country: string,
	location_postcode: string,
}

export const userRESTSubmitLink: string = '/user/';
export interface UserRESTSubmit {
	first_name: string,
	last_name: string,
	email: string,
	location_town: string,
	location_country: string,
	location_postcode: string,
	bio: string
}

interface RefreshTokensRESTSubmit {
	refresh: string
}

interface RefreshTokensREST {
	access: string
}

export interface ItemREST {
	name: string,
	bio: string,
	seller_name: string,
	upload_date: string,
	shape: string,
	colour: string,
	tag0: string,
	tag1: string,
	tag2: string,
	tag3: string,
	tag4: string
}
export const itemsListRESTLink: string = '/get_items/';
export type ItemRESTList = ItemREST[];

export interface ItemRESTSubmit {
	bio: string,
	shape: string,
	colour: string,
	tag0: string,
	tag1: string,
	tag2: string,
	tag3: string,
	tag4: string
}

export type ItemRESTSubmitKeys = "bio" | "shape" | "colour" | "tag0" | "tag1" | "tag2" | "tag3" | "tag4";
export type ItemColours = "yellow" | "black" | "silver";
export type ItemShapes = "shirt" | "jewelery" | "skirt";
export type ItemStyles = "" | "kitsch" | "modern" | "pastel" | "vibey" | "deadstock";

export interface ItemTypeRESTNewSubmit {
	price: number,
	quantity: number,
	size: string,
	available: boolean
}

export interface ItemTypeRESTChangeSubmit {
	price: number,
	quantity: number,
	size: string,
	available: boolean
}

export interface ItemTypeREST {
	id: string,
	item: string,
	price: number,
	quantity: number,
	size: string,
	available: boolean
}
export const itemTypeListRESTLink = '/get_item_types/';
export type ItemTypeRESTList = ItemTypeREST[];

export type ItemTypeRESTNewSubmitKeys = "price" | "quantity" | "available" | "size";
export type ItemTypeRESTChangeSubmitKeys = "price" | "quantity" | "available" | "size";

export const itemTypeAvailableRESTLink: string = '/item_type_is_available/';
export interface ItemTypeAvailableREST {
	available: boolean
}

export interface BasketItem {
	price: number,
	size: string,
	name: string,
	seller_name: string,
	shape: string,
	colour: string,
	type_id: string,
	quantity: number,
	available: boolean
}

export const stripePaymentIntentRESTLink = '/payment_intents/';
export interface StripePaymentIntentRESTSubmit {
	amount: number,
	item_types: BasketItem[],
	buyer_name: string
}
export interface StripePaymentIntentREST {
	client_secrets: string[]
}

export const stripeUndoPaymentIntentRESTLink = '/undo_payment_intent/';
export interface StripeUndoPaymentIntentRESTSubmit {
	client_secret: string,
	item_type: BasketItem,
	buyer_name: string
}
export interface StripeUndoPaymentIntentREST { }

export const userStripeUpdateLinkRESTLink: string = '/get_user_stripe_update_link/';
export interface UserStripeUpdateLinkREST {
	update_link: string
}

export const userStripeOnboardingLinkRESTLink: string = '/get_user_stripe_onboarding_link/';
export interface UserStripeOnboardingLinkREST {
	onboarding_link: string
}

export const verifyUserRESTLink: string = '/verify_user/';
export interface UserVerifyREST {
	verified: boolean
}

export function getActualPriceString(price: number, quantity: number): string {
	return (Math.round((price * quantity) * 100) / 100).toFixed(2)
}

export const orderListRESTLink = '/orders/';
export interface OrderREST {
	item: string,
	item_type: number,
	quantity: number,
	purchase_date: string,
	payment_successful: boolean,
	shipped: boolean,
	arrived: boolean,
	shipping_tag: string
}
export type OrderListREST = OrderREST[];

async function getNewAccessToken(): Promise<boolean> {
	try {
		const tokens: Tokens = JSON.parse(localStorage.tokens);

		if (tokens.refresh !== "") {
			const data: RefreshTokensRESTSubmit = {
				refresh: tokens.refresh
			};

			const result: Result<RefreshTokensREST, Error> = await resolvePOSTCall<RefreshTokensREST, RefreshTokensRESTSubmit>('/auth/refresh_tokens/', data);

			result
				.map(res => {
					tokens.access = res.access;
					localStorage.setItem("tokens", JSON.stringify(tokens));

					return null; // necessary to silence warning
				})
				.mapErr(err => {
					console.error(err);
				});

			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
}

export async function resolveGETCall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.get<MessageT>(config.apiURL + address);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.get<MessageT>(config.apiURL + address, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveGETCall<MessageT>(address, authentication, true);
		}

		return err(error);
	}
}

export async function resolvePOSTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.post<MessageT>(config.apiURL + address, data);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.post<MessageT>(config.apiURL + address, data, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePOSTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		return err(error);
	}
}

export async function resolvePUTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.put<MessageT>(config.apiURL + address, data);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.put<MessageT>(config.apiURL + address, data, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePUTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		return err(error);
	}
}

export async function resolveDELETECall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.delete<MessageT>(config.apiURL + address);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.delete<MessageT>(config.apiURL + address, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveDELETECall<MessageT>(address, authentication, true);
		}

		return err(error);
	}
}