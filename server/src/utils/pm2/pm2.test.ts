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
                        pm_id: 666,
                        pid: 6666,
                        name: '@bleed-believer/daemon',
                        monit: {
                            cpu: 666,
                            memory: 999
                        },
                        pm2_env: {
                            args:               [ 'server' ],
                            node_args:          [],

                            pm_cwd:             '/home/pendejo/@bleed-believer/daemon',
                            pm_pid_path:        '/home/pendejo/.pm2/',
                            pm_exec_path:       '/home/pendejo/.pm2/pids/-bleed-believer-daemon-666.pid',
                            pm_err_log_path:    '/home/pendejo/.pm2/pids/-bleed-believer-daemon-error.log',
                            pm_out_log_path:    '/home/pendejo/.pm2/pids/-bleed-believer-daemon-out.log',

                            version:            '6.6.6',
                            node_version:       '24.0.0',

                            created_at:         new Date(2026, 0, 1).getTime(),
                            restart_time:       0,
                            kill_retry_time:    100,
                            unstable_restarts:  0,

                            status:             'online',
                            unique_id:          '66666666-6666-6666-6666-666666666666',
                            namespace:          'default',

                            exec_mode:          'fork_mode',
                            filter_env:         [],
                            exec_interpreter:   'node',

                            pmx:                true,
                            watch:              false,
                            vizion:             true,
                            km_link:            false,
                            treekill:           true,
                            autostart:          true,
                            merge_logs:         true,
                            automation:         true,
                            windowsHide:        true,
                            autorestart:        true,
                            vizion_running:     false,

                            username:           'pendejo',
                            instance_var:       'NODE_APP_INSTANCE',

                            env: {
                                FOO: 'bar',
                                BAK: 'baz'
                            },

                            axm_monitor: {
                                'Used Heap Size': {
                                    value: '33.33',
                                    type: 'internal/v8/heap/used',
                                    unit: 'MiB',
                                    historic: true
                                },
                                'Heap Usage': {
                                    value: 66.66,
                                    type: 'internal/v8/heap/usage',
                                    unit: '%',
                                    historic: true
                                },
                                'Heap Size': {
                                    value: '99.99',
                                    type: 'internal/v8/heap/total',
                                    unit: 'MiB',
                                    historic: true
                                }
                            },

                            axm_options: {
                                error: true,
                                heapdump: true,
                                'feature.profiler.heapsnapshot': false,
                                'feature.profiler.heapsampling': true,
                                'feature.profiler.cpuJs': true,
                                latency: true,
                                catchExceptions: true,
                                profiling: true,
                                metrics: {
                                    http: true,
                                    runtime: true,
                                    eventLoop: true,
                                    network: false,
                                    v8: true
                                },
                                standalone: false,
                                moduleConf: {},
                                apm: { version: '6.1.0', type: 'node' },
                                moduleName: '@bleed-believer/daemon',
                                moduleVersion: '6.0.14'
                            },

                            axm_actions: [
                                {
                                    action_name: 'km:heapdump',
                                    action_type: 'internal',
                                    arity: 2
                                },
                                {
                                    action_name: 'km:cpu:profiling:start',
                                    action_type: 'internal',
                                    arity: 2
                                },
                                {
                                    action_name: 'km:cpu:profiling:stop',
                                    action_type: 'internal',
                                    arity: 1
                                },
                                {
                                    action_name: 'km:heap:sampling:start',
                                    action_type: 'internal',
                                    arity: 2
                                },
                                {
                                    action_name: 'km:heap:sampling:stop',
                                    action_type: 'internal',
                                    arity: 1
                                }
                            ]
                        }
                    }
                ])
            })
        };

        const pm2 = new PM2(inject);
        const res = await pm2.list();
        t.assert.deepStrictEqual(res, [
            {
                id: 666,
                pid: 6666,
                name: '@bleed-believer/daemon',
                args: [ 'server' ],
                nodeArgs: [],
                cwd: '/home/pendejo/@bleed-believer/daemon',
                pidPath: '/home/pendejo/.pm2/',
                execPath: '/home/pendejo/.pm2/pids/-bleed-believer-daemon-666.pid',
                errLogPath: '/home/pendejo/.pm2/pids/-bleed-believer-daemon-error.log',
                outLogPath: '/home/pendejo/.pm2/pids/-bleed-believer-daemon-out.log',
                version: '6.6.6',
                nodeVersion: '24.0.0',
                createdAt: new Date(2026, 0, 1),
                restartTime: 0,
                killRetryTime: 100,
                unstableRestarts: 0,
                status: 'online',
                uniqueId: '66666666-6666-6666-6666-666666666666',
                namespace: 'default',
                execMode: 'fork_mode',
                filterEnv: [],
                execInterpreter: 'node',
                pmx: true,
                watch: false,
                vizion: true,
                kmLink: false,
                treekill: true,
                autostart: true,
                mergeLogs: true,
                automation: true,
                windowsHide: true,
                autorestart: true,
                vizionRunning: false,
                username: 'pendejo',
                instanceVar: 'NODE_APP_INSTANCE',
                env: { FOO: 'bar', BAK: 'baz' },
                monit: { cpu: 666, memory: 999 },
                axmMonitor: {
                    'Used Heap Size': {
                        value: '33.33',
                        type: 'internal/v8/heap/used',
                        unit: 'MiB',
                        historic: true
                    },
                    'Heap Usage': {
                        value: 66.66,
                        type: 'internal/v8/heap/usage',
                        unit: '%',
                        historic: true
                    },
                    'Heap Size': {
                        value: '99.99',
                        type: 'internal/v8/heap/total',
                        unit: 'MiB',
                        historic: true
                    }
                },
                axmOptions: {
                    error: true,
                    heapdump: true,
                    'feature.profiler.heapsnapshot': false,
                    'feature.profiler.heapsampling': true,
                    'feature.profiler.cpuJs': true,
                    latency: true,
                    catchExceptions: true,
                    profiling: true,
                    metrics: {
                        http: true,
                        runtime: true,
                        eventLoop: true,
                        network: false,
                        v8: true
                    },
                    standalone: false,
                    moduleConf: {},
                    apm: { version: '6.1.0', type: 'node' },
                    moduleName: '@bleed-believer/daemon',
                    moduleVersion: '6.0.14'
                },
                axmActions: [
                    { name: 'km:heapdump', type: 'internal', arity: 2 },
                    { name: 'km:cpu:profiling:start', type: 'internal', arity: 2 },
                    { name: 'km:cpu:profiling:stop', type: 'internal', arity: 1 },
                    { name: 'km:heap:sampling:start', type: 'internal', arity: 2 },
                    { name: 'km:heap:sampling:stop', type: 'internal', arity: 1 }
                ]
            }
        ]);
    });
});