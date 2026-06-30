import type { PM2Inject, PM2Process } from './interfaces/index.js';

import { toCamelCase } from './to-camel-case.js';
import { asyncSpawn } from '@utils/async-spawn';

export class PM2 {
    #injected: Required<PM2Inject>;

    constructor(inject?: PM2Inject) {
        this.#injected = {
            asyncSpawn: inject?.asyncSpawn?.bind(inject)    ??  asyncSpawn
        };
    }

    async list(): Promise<PM2Process[]> {
        const { code, stdout, stderr } = await this.#injected.asyncSpawn('pm2', {
            encoding: 'utf-8',
            args: [ 'prettylist' ]
        });

        if (code !== 0) {
            throw new Error(stderr ?? stdout ?? 'Unknown error');
        }

        const json = JSON.parse(stdout ?? '[]') as PM2Process[];
        return json
            .map(x => toCamelCase(x))
            .map(x => ({
                pid: x.pid,
                name: x.name,
                pm2Env: {
                    version: x.pm2Env.version,
                    nodeVersion: x.pm2Env.nodeVersion,
                    restartTime: x.pm2Env.restartTime,
                    unstableRestarts: x.pm2Env.unstableRestarts,
                }
            }));
    }
}