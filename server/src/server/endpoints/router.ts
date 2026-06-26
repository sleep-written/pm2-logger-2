import { Router } from 'express';

import { indexRouter } from './index.router.js';
import { apiRouter } from './api/router.js';

/**
 * Top-level Express router. Mounts the REST API under `/api` and falls back to
 * the static SPA router for everything else.
 */
export const endpointsRouter = Router()
    .use('/api', apiRouter)
    .use(indexRouter);