import { Router } from 'express';

import { injector } from '@/injector.js';
import { PM2 } from '@utils/pm2';

export const getEndpoint = Router().get('/', async (_, res) => {
    const pm2 = injector.inject(PM2);
    const list = await pm2.list();
    res.json(list);
});