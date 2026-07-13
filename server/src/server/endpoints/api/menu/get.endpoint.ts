import { Router } from 'express';

import { Menu } from '@entities/menu';

export const getEndpoint = Router().use('/', async (_, res) => {
    const menu = await Menu.find({});
    res.json(menu);
});