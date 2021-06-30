import axios from 'axios';
import { ok, err, Result } from 'neverthrow';

import config from './config';

export async function resolveRESTCall<T> (address: string): Promise<Result<T, Error>> {
	try {
		const res = await axios.get<T>(config.apiURL + address);
  	
  	return ok(res.data);
  } catch (error) {
  	return err(error);
  }
}