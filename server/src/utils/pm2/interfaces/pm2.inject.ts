export interface PM2Inject {
    asyncSpawn?(
        command: string,
        options: {
            env?: NodeJS.ProcessEnv;
            cwd?: string;
            args?: string[];
            encoding: BufferEncoding;
        }
    ): Promise<{
        code: number | null;
        stdout?: string;
        stderr?: string;
    }>;
}