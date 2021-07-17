import axios, { AxiosResponse } from 'axios';
import { ok, err, Result } from 'neverthrow';

import config from './config';

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
	alert: AlertBarUpdater
}

export interface Tokens {
	access: string,
	refresh: string
}

export interface LStorage {
	tokens: Tokens,
	username: string
}

export interface TokenREST {
	username: string,
	tokens: Tokens
}

export interface UserREST {
	first_name: string,
	last_name: string,
	email: string
}

export interface RegistrationRESTSubmit {
	username: string,
	password: string,
	first_name: string,
	last_name: string,
	email: string
}

export interface UserRESTSubmit {
	first_name: string,
	last_name: string,
	email: string
}

export async function resolveGETCall<MessageT>(address: string, authentication: boolean = false): Promise<Result<MessageT, Error>> {
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
		return err(error);
	}
}

export async function resolvePOSTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false): Promise<Result<MessageT, Error>> {
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
		return err(error);
	}
}

export async function resolvePUTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false): Promise<Result<MessageT, Error>> {
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
		return err(error);
	}
}

export async function resolveDELETECall<MessageT>(address: string, authentication: boolean = false): Promise<Result<MessageT, Error>> {
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
		return err(error);
	}
}