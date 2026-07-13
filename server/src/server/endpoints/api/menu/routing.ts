import { Router } from 'express';

import { getEndpoint } from './get.endpoint.js';

export const menuRouting = Router()
    .use(getEndpoint);