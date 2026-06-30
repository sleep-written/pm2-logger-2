import type { PM2Env } from './pm2-env.js';

export interface PM2Process {
    pid: number;
    name: string;
    pm2Env: PM2Env;
}