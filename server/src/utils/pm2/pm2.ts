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
            args: [ 'jlist' ]
        });

        if (code !== 0) {
            throw new Error(stderr ?? stdout ?? 'Unknown error');
        }

        const json = JSON.parse(stdout ?? '[]') as unknown[];
        return json.map((x: any) => ({
            id:                 x.pm_id,
            pid:                x.pid,
            name:               x.name,
            args:               x.pm2_env.args,
            nodeArgs:           x.pm2_env.node_args,

            cwd:                x.pm2_env.pm_cwd,
            pidPath:            x.pm2_env.pm_pid_path,
            execPath:           x.pm2_env.pm_exec_path,
            errLogPath:         x.pm2_env.pm_err_log_path,
            outLogPath:         x.pm2_env.pm_out_log_path,

            version:            x.pm2_env.version,
            nodeVersion:        x.pm2_env.node_version,

            createdAt:          new Date(x.pm2_env.created_at),
            restartTime:        x.pm2_env.restart_time,
            killRetryTime:      x.pm2_env.kill_retry_time,
            unstableRestarts:   x.pm2_env.unstable_restarts,

            status:             x.pm2_env.status,
            uniqueId:           x.pm2_env.unique_id,
            namespace:          x.pm2_env.namespace,

            execMode:           x.pm2_env.exec_mode,
            filterEnv:          x.pm2_env.filter_env,
            execInterpreter:    x.pm2_env.exec_interpreter,
            
            pmx:                !!x.pm2_env.pmx,
            watch:              !!x.pm2_env.watch,
            vizion:             !!x.pm2_env.vizion,
            kmLink:             !!x.pm2_env.km_link,
            treekill:           !!x.pm2_env.treekill,
            autostart:          !!x.pm2_env.autostart,
            mergeLogs:          !!x.pm2_env.merge_logs,
            automation:         !!x.pm2_env.automation,
            windowsHide:        !!x.pm2_env.windowsHide,
            autorestart:        !!x.pm2_env.autorestart,
            vizionRunning:      !!x.pm2_env.vizion_running,

            username:           x.pm2_env.username,
            instanceVar:        x.pm2_env.instance_var,
            
            env:                x.pm2_env.env,
            monit:              toCamelCase(x.monit),
            axmMonitor:         toCamelCase(x.pm2_env.axm_monitor),
            axmOptions:         toCamelCase(x.pm2_env.axm_options),
            axmActions:         x.pm2_env.axm_actions.map((o: any) => ({
                name:   o.action_name,
                type:   o.action_type,
                arity:  o.arity,
            }))
        }));
    }
}