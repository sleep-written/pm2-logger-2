import { Router } from 'express';

import { userRouter } from './user/router.js';

/** REST API router. Aggregates the per-resource routers under `/api`. */
export const apiRouter = Router()
    .use('/user', userRouter);