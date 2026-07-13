export interface PM2Logger {
    onStdout(callback: (message: string) => unknown): void;
    onStderr(callback: (message: string) => unknown): void;
    get listening(): boolean;
    destroy(): void;
}