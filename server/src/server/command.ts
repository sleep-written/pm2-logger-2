import type { CommandTarget } from '@bleed-believer/commander';

import { createServer } from 'node:http';
import { SocketServer } from '@bleed-believer/ws/server';
import { styleText } from 'node:util';
import { Command } from '@bleed-believer/commander';
import express from 'express';

import { endpointsRouter } from './endpoints/router.js';
import { dataSource } from '@/data-source.js';
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
        port: {
            type: 'number',
            short: 'p',
            description: [
                `The port which the server will be mounted. By default`,
                `the port is ${styleText('blueBright', '8080')}.`
            ].join('\n')
        },
        mock: {
            type: 'boolean',
            short: 'm',
            description: [
                `Replaces the real pm2 wrapper for a fake pm2 wrapper`,
                `implementation. For testing purposes.`
            ].join('\n')
        }
    },
    description: [
        'Initializes the web server to monit active pm2',
        'project instances.'
    ].join('\n'),
    callback: c => new class implements CommandTarget {
        async onInit(): Promise<void> {
            if (c.flags.mock) {
                injector.provide(PM2, PM2Mock);
                console.info(
                    `[${styleText('greenBright', 'SERV')}]`,
                    `Initialize database...`
                );
            }

            await dataSource.initialize();
            console.info(`[${styleText('blueBright',  'MOCK')}] PM2 → PM2Mock`);

            const port = c.flags.port ?? 8080;
            await new Promise<void>((resolve, reject) => {
                const app = express();
                app.use(endpointsRouter);

                const server = createServer(app);
                const wss = new SocketServer({ server })
                    .use(socketRouter)
                    .bind();

                server.listen(port);
                server.once('error', err => reject(err));
                server.once('close', () => resolve());

                const destroy = () => {
                    if (server.listening) {
                        wss.close();
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

            console.info(
                `[${styleText('greenBright', 'SERV')}]`,
                'Server is destroyed...'
            );
        }

        async onDestroy(): Promise<void> {
            if (dataSource.isInitialized) {
                console.info(
                    `[${styleText('greenBright', 'SERV')}]`,
                    'Destroying database connection...'
                );
                
                await dataSource.destroy();
            }
        }
    }
});