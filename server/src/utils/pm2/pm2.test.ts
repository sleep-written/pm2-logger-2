import type { PM2Inject } from './interfaces/index.js';

import { describe, it } from 'node:test';
import { PM2 } from './pm2.js';

describe('PM2', () => {
    it('List all process', async (t: it.TestContext) => {
        const inject: PM2Inject = {
            asyncSpawn: () => Promise.resolve({
                code: 0,
                stdout: JSON.stringify([
                    {
                        pid: 666,
                        name: 'daemon'
                    }, 
                    {
                        pid: 999,
                        name: 'demiurgo'
                    }
                ])
            })
        };

        const pm2 = new PM2(inject);
        const res = await pm2.list();
        t.assert.deepStrictEqual(res, [
            {
                pid: 666,
                name: 'daemon'
            }, 
            {
                pid: 999,
                name: 'demiurgo'
            }
        ]);
    });
});