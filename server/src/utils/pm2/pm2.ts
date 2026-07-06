import type { PM2Inject, PM2Logger, PM2Process } from './interfaces/index.js';

import { stripVTControlCharacters } from 'node:util';
import { EventEmitter } from 'node:events';
import { spawn } from 'node:child_process';

import { PM2CLIError } from './pm2-cli.error.js';
import { asyncSpawn } from '@utils/async-spawn';

export class PM2 {
    #injected: Required<PM2Inject>;
    #env: NodeJS.ProcessEnv;

    constructor(inject?: PM2Inject) {
        this.#injected = {
            asyncSpawn: inject?.asyncSpawn?.bind(inject)    ?? asyncSpawn,
            spawn:      inject?.spawn?.bind(inject)         ?? spawn,

            process:    inject?.process                     ?? globalThis.process
        };

        this.#env = { ...this.#injected.process.env };
        delete this.#env['NODE_OPTIONS'];
    }

    async #exec(...args: { toString(): string; }[]): Promise<string | undefined> {
        const { code, stdout, stderr } = await this.#injected.asyncSpawn('pm2', {
            encoding: 'utf-8',
            args: args.map(x => x.toString()),
            env: this.#env
        });

        if (code !== 0) {
            throw new PM2CLIError(code, stderr ?? stdout);
        }

        return typeof stdout === 'string'
        ?   stripVTControlCharacters(stdout)
        :   undefined;
    }

    async list(): Promise<PM2Process[]> {
        const text = await this.#exec('jlist') ?? '[]';
        const json = JSON.parse(text) as any[];
        return json.map(x => ({
            id:             x.pm_id,
            pid:            x.pid,
            name:           x.name,
            args:           x.pm2_env.args ?? [],
            nodeArgs:       x.pm2_env.node_args,
            execMode:       x.pm2_env.exec_mode,
            namespace:      x.pm2_env.namespace,
            interpreter:    x.pm2_env.exec_interpreter,

            cwd:            x.pm2_env.pm_cwd,
            pidPath:        x.pm2_env.pm_pid_path,
            execPath:       x.pm2_env.pm_exec_path,
            outLogPath:     x.pm2_env.pm_out_log_path,
            errLogPath:     x.pm2_env.pm_err_log_path,

            status:         x.pm2_env.status,
            uptime:         x.pm2_env.pm_uptime,
            createdAt:      new Date(x.pm2_env.created_at),
            
            env:            x.pm2_env.env,
            monit:          {
                cpu:        x.monit.cpu,
                memory:     x.monit.memory,
            },
            instance:       {
                id:         x.pm2_env.unique_id,
                value:      x.pm2_env[x.pm2_env.instance_var],
            },
        }));
    }

    async getProcessIds(processName: string): Promise<number[]> {
        const text = await this.#exec('id', processName) ?? '[]';
        const json = JSON.parse(text) as number[];
        if (!Array.isArray(json) || json.some(x => isNaN(x))) {
            throw new PM2CLIError(0, `Invalid JSON array number: ${text}`);
        }

        return json;
    }

    async stop(processId: number, ...otherProcessIds: number[]): Promise<void> {
        await this.#exec('stop', processId, ...otherProcessIds, '-s');
    }

    async start(processId: number, ...otherProcessIds: number[]): Promise<void> {
        await this.#exec('start', processId, ...otherProcessIds, '-s');
    }

    async restart(processId: number, ...otherProcessIds: number[]): Promise<void> {
        await this.#exec('restart', processId, ...otherProcessIds, '-s');
    }

    log(processIds: number[], encoding?: BufferEncoding): PM2Logger {
        const child = this.#injected.spawn(
            'pm2', [ 'log', ...processIds.map(x => x.toString()) ],
            { env: this.#env }
        );


        const logger = new EventEmitter() as PM2Logger;
        Object.defineProperty(logger, 'killed', {
            get: () => child.killed
        });

        logger.kill = () => {
            if (!child.killed) {
                logger.removeAllListeners();
                child.kill();
            }
        };

        logger.wait = new Promise<void>((resolve, reject) => {
            child.stdout.on('data', (c: Buffer) => logger.emit('stdout', c.toString(encoding ?? 'utf-8')));
            child.stderr.on('data', (c: Buffer) => logger.emit('stderr', c.toString(encoding ?? 'utf-8')));
            child.on('error', err => reject(err));
            child.on('close', () => {
                resolve();
            });
        });

        return logger;
    }
}