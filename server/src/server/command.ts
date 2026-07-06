import type { CommandTarget } from '@bleed-believer/commander';

import { createServer } from 'node:http';
import { SocketServer } from '@bleed-believer/ws';
import { styleText } from 'node:util';
import { Command } from '@bleed-believer/commander';
import express from 'express';

import { endpointsRouter } from './endpoints/router.js';
import { environment } from '@/environment.js';
import { injector } from '@/injector.js';

import { socketRouter } from './sockets/router.js';
import { PM2Mock } from './pm2.mock.js';
import { PM2 } from '@utils/pm2';

/**
 * `server` command — boots the Express web server and keeps it listening until
 * `SIGINT`/`SIGTERM`, then shuts the socket down cleanly. The listening port is
 * read from the `PM2_LOGGER_PORT` environment variable (default `8080`).
 */
export const serverCommand = new Command({
    positionals: 'server',
    flags: {
        mockPm2: {
            type: 'boolean',
            description: [
                `Replaces the real pm2 wrapper for a fake pm2 wrapper`,
                `implementation. For testing purposes.`
            ].join('\n')
        }
    },
    description: [
        'Initializes the web server to monit active pm2',
        'project instances. You can change the port with',
        `the environment variable ${styleText('yellow', 'PM2_LOGGER_PORT')}.`
    ].join('\n'),
    callback: c => new class implements CommandTarget {
        async onInit(): Promise<void> {
            if (c.flags.mockPm2) {
                injector.provide(PM2, PM2Mock);
                console.info(`[${styleText('blueBright',  'MOCK')}] PM2 → PM2Mock`);
            }

            const port = await environment.get('port');
            await new Promise<void>((resolve, reject) => {
                const app = express();
                app.use(endpointsRouter);
                app.get('*hola', (req) => { req.params.hola })

                const server = createServer(app);
                const wss = new SocketServer()
                    .use(socketRouter)
                    .bootstrap(server);

                server.listen(port);
                server.once('error', err => reject(err));
                server.once('close', () => resolve());

                const destroy = () => {
                    if (server.listening) {
                        for (const client of wss.clients) {
                            client.close();
                        }

                        server.close();
                        process.removeAllListeners('SIGINT');
                        process.removeAllListeners('SIGTERM');
                    };
                }

                process.once('SIGINT', destroy);
                process.once('SIGTERM', destroy);
                console.info(
                    `[${styleText('greenBright', 'SERV')}]`,
                    `Port: ${styleText('blueBright', port.toString())};`,
                    'listening!'
                );
            });
            
            console.info('Server is destroyed...');
        }
    }
});