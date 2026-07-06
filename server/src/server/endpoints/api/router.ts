import { Router } from 'express';

import { userRouter } from './user/router.js';
import { pm2Router } from './pm2/router.js';

/** REST API router. Aggregates the per-resource routers under `/api`. */
export const apiRouter = Router()
    .use('/user', userRouter)
    .use('/pm2', pm2Router);