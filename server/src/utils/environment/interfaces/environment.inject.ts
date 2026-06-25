export interface EnvironmentInject {
    process?: { env: NodeJS.ProcessEnv; };

    stat?(
        path: string
    ): Promise<{
        isFile(): boolean;
    }>;

    mkdir?(
        path: string,
        opts: {
            force: true;
            recursive: true;
        }
    ): Promise<string | undefined>;

    dirname?(
        path: string
    ): string;

    readFile?(
        path: string,
        encoding: 'utf-8'
    ): Promise<string>;

    writeFile?(
        path: string,
        content: string,
        encoding: 'utf-8'
    ): Promise<void>;
}