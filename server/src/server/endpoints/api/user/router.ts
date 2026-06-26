import { Router } from 'express';
import { getEndpoint } from './get.endpoint.js';

/** Router for the `/api/user` resource. */
export const userRouter = Router()
    .use(getEndpoint);