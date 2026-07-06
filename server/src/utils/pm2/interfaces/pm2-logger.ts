import type EventEmitter from 'node:events';

export interface PM2Logger extends EventEmitter<{
    stdout: [ message: string ];
    stderr: [ message: string ];
}> {
    get killed(): boolean;
    kill(): void;
    wait: Promise<void>;
}