import type { PM2ProcessInstance } from './pm2-process.instance.js';
import type { PM2ProcessMonit } from './pm2-process.monit.js';

export interface PM2Process {
    id:             number;
    pid:            number;
    name:           string;
    args:           string[];
    nodeArgs:       string[];
    execMode:       string;
    namespace:      string;
    interpreter:    string;

    cwd:            string;
    pidPath:        string;
    execPath:       string;
    outLogPath:     string;
    errLogPath:     string;

    status:         string;
    uptime:         number;
    createdAt:      Date;

    env:            NodeJS.ProcessEnv;
    monit:          PM2ProcessMonit;
    instance:       PM2ProcessInstance;
}