import type EventEmitter from 'node:events';

export interface ChildProcess extends EventEmitter<{
    error:  [ Error ];
    close:  [ number | null ];
}> {
    stdout: EventEmitter<{ data: [ any ]; }>;
    stderr: EventEmitter<{ data: [ any ]; }>;
    killed: boolean;
    kill(): void;
}