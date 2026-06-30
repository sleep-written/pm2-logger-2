import type { AxmAction } from './axm-actions.js';
import type { AxmMonitor } from './axm-monitor.js';
import type { AxmOptions } from './axm-options.js';
import type { PM2ProcessMonit } from './pm2-process-monit.js';

export interface PM2Process {
    id: number;
    pid: number;
    name: string;
    args: string[];
    nodeArgs: string[];

    cwd: string;
    pidPath: string;
    execPath: string;
    errLogPath: string;
    outLogPath: string;

    version: string;
    nodeVersion: string;
    
    createdAt: Date;
    restartTime: number;
    killRetryTime: number;
    unstableRestarts: number;

    status: string;
    uniqueId: string;
    namespace: string;

    execMode: string;
    filterEnv: string[];
    execInterpreter: string;

    pmx: boolean;
    watch: boolean;
    vizion: boolean;
    kmLink: boolean;
    treekill: boolean;
    autostart: boolean;
    mergeLogs: boolean;
    automation: boolean;
    windowsHide: boolean;
    autorestart: boolean;
    vizionRunning: boolean;

    username: string;
    instanceVar: string;

    env: NodeJS.ProcessEnv;
    monit: PM2ProcessMonit;
    axmMonitor: AxmMonitor;
    axmOptions: AxmOptions;
    axmActions: AxmAction[];
}