import type { AsyncSpawnOptions, AsyncSpawnOutput, AsyncSpawnRawOutput } from './interfaces/index.js';

import { spawn } from 'node:child_process';

/**
 * Promise-based wrapper around {@link spawn} that buffers a child process'
 * output and resolves once it closes.
 *
 * The return shape is driven by `options.encoding`: when an encoding is
 * provided, `stdout`/`stderr` are decoded and trimmed into strings
 * ({@link AsyncSpawnOutput}); otherwise the raw {@link Buffer}s are returned
 * ({@link AsyncSpawnRawOutput}). Empty streams are omitted from the result.
 *
 * @typeParam O - The shape of the provided options.
 * @typeParam T - The resolved output shape, inferred from `O['encoding']`.
 *
 * @param command - The executable to run.
 * @param options - Spawn configuration (see {@link AsyncSpawnOptions}).
 * @returns A promise resolving with the exit `code` and captured output.
 * @throws If the child process emits an `error` event (e.g. it cannot spawn).
 *
 * @example
 * ```ts
 * const { code, stdout } = await asyncSpawn('git', {
 *     args: ['rev-parse', 'HEAD'],
 *     encoding: 'utf-8',
 * });
 * ```
 */
export const asyncSpawn = <
    O extends AsyncSpawnOptions,
    T extends O['encoding'] extends BufferEncoding
    ?   AsyncSpawnOutput
    :   AsyncSpawnRawOutput
>(
    command: string,
    options?: O
) => new Promise<T>((resolve, reject) => {
    const spawnProcess = spawn(command, options?.args ?? [], {
        env: options?.env,
        cwd: options?.cwd
    });

    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    spawnProcess.stdout.on('data', (chunk: Buffer) => stdout.push(chunk));
    spawnProcess.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
    spawnProcess.once('error', err => reject(err));
    spawnProcess.once('close', code => {
        const out = { code } as T;
        if (stdout.length > 0) {
            out.stdout = typeof options?.encoding === 'string'
            ?   Buffer.concat(stdout).toString(options.encoding).trim()
            :   Buffer.concat(stdout);
        }
        
        if (stderr.length > 0) {
            out.stderr = typeof options?.encoding === 'string'
            ?   Buffer.concat(stderr).toString(options.encoding).trim()
            :   Buffer.concat(stderr);
        }

        resolve(out);
    });
});