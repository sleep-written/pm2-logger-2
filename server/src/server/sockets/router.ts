import { SocketServerRouter } from '@bleed-believer/ws/server';
import { logRoute } from './log.route.js';

export const socketRouter = new SocketServerRouter()
    .use(logRoute);