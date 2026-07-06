import type { PM2Inject, ChildProcess } from './interfaces/index.js';

import { describe, it } from 'node:test';
import { EventEmitter } from 'node:events';
import { PM2 } from './pm2.js';

describe('pm2', () => {
    it('List all process', async (t: it.TestContext) => {
        const inject: PM2Inject = {
            asyncSpawn: () => Promise.resolve({
                code: 0,
                stdout: JSON.stringify([
                    {
                        pm_id:  1,
                        pid:    6666,
                        name:   '@lore-builder/server',

                        pm2_env: {
                            args:               [ 'server' ],
                            node_args:          [],
                            exec_mode:          'fork_mode',
                            namespace:          'default',
                            exec_interpreter:   'node',

                            pm_cwd:             '/home/pendejo/@lore-builder/server',
                            pm_pid_path:        '/home/pendejo/.pm2/pids/-lore-builder-server-1.pid',
                            pm_exec_path:       '/home/pendejo/@lore-builder/server/dist/index.js',
                            pm_out_log_path:    '/home/pendejo/.pm2/logs/-lore-builder-server-out.log',
                            pm_err_log_path:    '/home/pendejo/.pm2/logs/-lore-builder-server-error.log',

                            status:             'online',
                            pm_uptime:          10_000,
                            created_at:         new Date(2026, 0, 1).getTime(),

                            instance_var:       'NODE_INSTANCE',
                            NODE_INSTANCE:      0,
                            unique_id:          '66666666-6666-6666-6666-666666666666',
                            env: {
                                FOO: 'BAR',
                                BAK: 'BAZ'
                            }
                        },
                        monit: {
                            cpu: 10,
                            memory: 110
                        }
                    },
                    {
                        pm_id:  2,
                        pid:    9999,
                        name:   '@lore-builder/daemon',

                        pm2_env: {
                            args:               [ 'daemon' ],
                            node_args:          [],
                            exec_mode:          'fork_mode',
                            namespace:          'default',
                            exec_interpreter:   'node',

                            pm_cwd:             '/home/pendejo/@lore-builder/server',
                            pm_pid_path:        '/home/pendejo/.pm2/pids/-lore-builder-daemon-2.pid',
                            pm_exec_path:       '/home/pendejo/@lore-builder/server/dist/index.js',
                            pm_out_log_path:    '/home/pendejo/.pm2/logs/-lore-builder-daemon-out.log',
                            pm_err_log_path:    '/home/pendejo/.pm2/logs/-lore-builder-daemon-error.log',

                            status:             'online',
                            pm_uptime:          10_000,
                            created_at:         new Date(2026, 0, 1).getTime(),

                            instance_var:       'NODE_INSTANCE',
                            NODE_INSTANCE:      0,
                            unique_id:          '66666666-9999-9999-9999-666666666666',
                            env: {
                                FOO: 'BAR',
                                BAK: 'ÑEE'
                            }
                        },
                        monit: {
                            cpu: 5,
                            memory: 80
                        }
                    }
                ])
            })
        };

        const pm2 = new PM2(inject);
        const list = await pm2.list();
        t.assert.deepStrictEqual(list, [
            {
                id: 1,
                pid: 6666,
                name: '@lore-builder/server',
                args: [ 'server' ],
                nodeArgs: [],
                execMode: 'fork_mode',
                namespace: 'default',
                interpreter: 'node',
                cwd: '/home/pendejo/@lore-builder/server',
                pidPath: '/home/pendejo/.pm2/pids/-lore-builder-server-1.pid',
                execPath: '/home/pendejo/@lore-builder/server/dist/index.js',
                outLogPath: '/home/pendejo/.pm2/logs/-lore-builder-server-out.log',
                errLogPath: '/home/pendejo/.pm2/logs/-lore-builder-server-error.log',
                status: 'online',
                uptime: 10000,
                createdAt: new Date(2026, 0, 1),
                env: {
                    FOO: 'BAR',
                    BAK: 'BAZ'
                },
                monit: {
                    cpu: 10,
                    memory: 110
                },
                instance: {
                    id: '66666666-6666-6666-6666-666666666666',
                    value: 0
                }
            },
            {
                id: 2,
                pid: 9999,
                name: '@lore-builder/daemon',
                args: [ 'daemon' ],
                nodeArgs: [],
                execMode: 'fork_mode',
                namespace: 'default',
                interpreter: 'node',
                cwd: '/home/pendejo/@lore-builder/server',
                pidPath: '/home/pendejo/.pm2/pids/-lore-builder-daemon-2.pid',
                execPath: '/home/pendejo/@lore-builder/server/dist/index.js',
                outLogPath: '/home/pendejo/.pm2/logs/-lore-builder-daemon-out.log',
                errLogPath: '/home/pendejo/.pm2/logs/-lore-builder-daemon-error.log',
                status: 'online',
                uptime: 10000,
                createdAt: new Date(2026, 0, 1),
                env: {
                    FOO: 'BAR',
                    BAK: 'ÑEE'
                },
                monit: {
                    cpu: 5,
                    memory: 80
                },
                instance: {
                    id: '66666666-9999-9999-9999-666666666666',
                    value: 0
                }
            }
        ]);
    });

    it('Log process using 2 ids', async (t: it.TestContext) => {
        const TIMER_ABORT_MS = 5_500;

        t.mock.timers.enable({
            apis: [ 'setTimeout', 'setInterval', 'setImmediate' ]
        });

        const inject: PM2Inject = {
            asyncSpawn: () => Promise.resolve({
                code: 0,
                stdout: JSON.stringify([ 1, 2 ])
            }),
            spawn: (_, args) => {
                const child = new EventEmitter() as ChildProcess;
                child.stdout = new EventEmitter();
                child.stderr = new EventEmitter();
                child.killed = false;

                setImmediate(() => {
                    child.stdout.emit(
                        'data',
                        Buffer.from(
                            `Argv: ${args.join(' ')}`,
                            'utf-8'
                        )
                    );
                });

                let i = 0;
                const clock = setInterval(
                    () => {
                        if (i === 3) {
                            child.stderr.emit('data', Buffer.from(
                                `Fulanito has sold his soul to the genocidal maniac called YHWH`,
                                'utf-8'
                            ));
                        }

                        child.stdout.emit('data', Buffer.from(
                            `The daemon was born at ${++i} seconds ago`,
                            'utf-8'
                        ));
                    },
                    1_000
                );
                
                child.kill = () => {
                    clearInterval(clock);
                    child.killed = true;
                    child.emit('close', 0);
                };

                return child;
            }
        };

        const killed: boolean[] = [];
        const stdout: string[] = [];
        const stderr: string[] = [];

        const pm2 = new PM2(inject);
        const ids = await pm2.getProcessIds('@bleed-believer/daemon');
        const log = pm2.log(ids);
        log.addListener('stdout', msg => stdout.push(msg));
        log.addListener('stderr', msg => stderr.push(msg));

        setTimeout(
            () => log.kill(),
            TIMER_ABORT_MS
        );

        killed.push(log.killed);
        t.mock.timers.tick(TIMER_ABORT_MS + 500);
        t.mock.timers.reset();

        await log.wait;
        killed.push(log.killed);

        t.assert.deepStrictEqual(killed, [ false, true ]);
        t.assert.deepStrictEqual(stdout, [
            `Argv: log 1 2`,
            `The daemon was born at 1 seconds ago`,
            `The daemon was born at 2 seconds ago`,
            `The daemon was born at 3 seconds ago`,
            `The daemon was born at 4 seconds ago`,
            `The daemon was born at 5 seconds ago`
        ]);

        t.assert.deepStrictEqual(stderr, [
            'Fulanito has sold his soul to the genocidal maniac called YHWH'
        ]);
    });
});