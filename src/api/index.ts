import { createHttpClient } from './httpClient';
import env from '../config';

export const http = createHttpClient({ baseURL: env.API_BASE_URL });


