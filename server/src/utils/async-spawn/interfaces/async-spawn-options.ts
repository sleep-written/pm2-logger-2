/**
 * Configuration accepted by {@link asyncSpawn}.
 *
 * The presence of `encoding` determines whether the call resolves with decoded
 * strings ({@link AsyncSpawnOutput}) or raw buffers ({@link AsyncSpawnRawOutput}).
 */
export interface AsyncSpawnOptions {
    /** Environment variables for the child process. Defaults to inheriting none. */
    env?: NodeJS.ProcessEnv;
    /** Working directory in which to run the command. */
    cwd?: string;
    /** Arguments passed to the command. Defaults to an empty list. */
    args?: string[];
    /** When set, `stdout`/`stderr` are decoded and trimmed using this encoding. */
    encoding?: BufferEncoding;
}