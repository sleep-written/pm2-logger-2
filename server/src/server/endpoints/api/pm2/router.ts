import { Router } from 'express';
import { getEndpoint } from './get.endpoint.js';

/** Router for the `/api/pm2` resource (endpoints under construction). */
export const pm2Router = Router()
    .use(getEndpoint);