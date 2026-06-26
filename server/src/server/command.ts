import type { CommandTarget } from '@bleed-believer/commander';

import { styleText } from 'node:util';
import { Command } from '@bleed-believer/commander';
import express from 'express';

import { endpointsRouter } from './endpoints/router.js';
import { environment } from '@/environment.js';

/**
 * `server` command — boots the Express web server and keeps it listening until
 * `SIGINT`/`SIGTERM`, then shuts the socket down cleanly. The listening port is
 * read from the `PM2_LOGGER_PORT` environment variable (default `8080`).
 */
export const serverCommand = new Command({
    positionals: 'server',
    description: [
        'Initializes the web server to monit active pm2',
        'project instances. You can change the port with',
        `the environment variable ${styleText('yellow', 'PM2_LOGGER_PORT')}.`
    ].join('\n'),
    callback: () => new class implements CommandTarget {
        async onInit(): Promise<void> {
            const app = express();
            app.use(endpointsRouter);

            await new Promise<void>(async (resolve, reject) => {
                const server = app.listen(await environment.get('port'));
                server.once('error', err => reject(err));
                server.once('close', () => resolve());

                const destroy = () => {
                    if (server.listening) {
                        server.close();
                        process.removeAllListeners('SIGINT');
                        process.removeAllListeners('SIGTERM');
                    };
                }

                process.once('SIGINT', destroy);
                process.once('SIGTERM', destroy);
                console.info('Server is listening!');
            });
            
            console.info('Server is destroyed...');
        }
    }
});