import type { PM2, PM2Logger, PM2Process } from '@utils/pm2';

import { EventEmitter } from 'node:events';
import { styleText } from 'node:util';

export class PM2Mock implements Partial<PM2> {
    #processList: Omit<PM2Process, 'uptime'>[] = [
        {
            id:             1,
            pid:            6666,
            name:           '@bleed-believer/server',
            args:           [ '-c', 'node ./dist/index.js server' ],
            nodeArgs:       [],
            execMode:       'fork_mode',
            namespace:      'default',
            interpreter:    'none',
            cwd:            '/home/pendejo/bleed-believer/server',
            pidPath:        '/home/pendejo/.pm2/pids/-bleed-believer-server-1.pid',
            execPath:       '/usr/bin/bash',
            outLogPath:     '/home/pendejo/.pm2/logs/-bleed-believer-server-out.log',
            errLogPath:     '/home/pendejo/.pm2/logs/-bleed-believer-server-error.log',
            status:         'online',
            createdAt:      new Date(),
            env: {
                FOO: 'BAR'
            },
            monit: {
                cpu:        8,
                memory:     90
            },
            instance: {
                id:         '66666666-6666-6666-6666-666666666666',
                value:      0
            }
        },
        {
            id:             2, 
            pid:            9999,
            name:           '@bleed-believer/daemon',
            args:           [ '-c', 'node ./dist/index.js daemon' ],
            nodeArgs:       [],
            execMode:       'fork_mode',
            namespace:      'default',
            interpreter:    'none',
            cwd:            '/home/pendejo/bleed-believer/server',
            pidPath:        '/home/pendejo/.pm2/pids/-bleed-believer-daemon-2.pid',
            execPath:       '/usr/bin/bash',
            outLogPath:     '/home/pendejo/.pm2/logs/-bleed-believer-daemon-out.log',
            errLogPath:     '/home/pendejo/.pm2/logs/-bleed-believer-daemon-error.log',
            status:         'online',
            createdAt:      new Date(),
            env: {
                FOO: 'BAZ'
            },
            monit: {
                cpu:        10,
                memory:     80
            },
            instance: {
                id:         '66666666-6666-6666-9999-666666666666',
                value:      0
            }
        }
    ];

    list() {
        return Promise.resolve(this.#processList.map(x => ({
            ...x,
            uptime: (
                new Date().getTime() -
                x.createdAt.getTime()
            )
        })));
    }

    getProcessIds(processName: string): Promise<number[]> {
        const ids = this.#processList
            .filter(x => x.name === processName)
            .map(x => x.id);

        return Promise.resolve(ids);
    }

    log(ids: number[]) {
        const log = new EventEmitter() as PM2Logger;
        const controller = new AbortController();
        Object.defineProperty(log, 'killed', {
            get: () => controller.signal.aborted
        });

        const processList = ids.length > 0
        ?   this.#processList.filter(x => ids.includes(x.id))
        :   this.#processList;

        const interval = setInterval(
            () => {
                for (const process of processList) {
                    const message: string[] = [
                        `[${styleText('blueBright', process.name)}]:`,
                        '💀'.padStart(Math.trunc(Math.random() * 20), ' ')
                    ];

                    log.emit('stdout', message.join(' '));
                }
            },
            1000
        );

        controller.signal.onabort = () => clearInterval(interval);
        log.kill = () => controller.abort();
        return log;
    }
}