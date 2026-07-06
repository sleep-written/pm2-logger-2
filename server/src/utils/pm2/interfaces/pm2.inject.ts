import type { ChildProcess } from './child-process.js';

export interface PM2Inject {
    asyncSpawn?(
        command: string,
        options: {
            encoding: BufferEncoding;
            args?: string[];
            env?: NodeJS.ProcessEnv;
        }
    ): Promise<{
        code: number | null;
        stdout?: string;
        stderr?: string;
    }>;

    spawn?(
        command: string,
        args: string[],
        opts: { env: NodeJS.ProcessEnv; }
    ): ChildProcess;

    process?: {
        env: NodeJS.ProcessEnv;
    };
}