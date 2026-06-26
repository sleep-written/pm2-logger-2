/**
 * Result of {@link asyncSpawn} when no `encoding` is provided: captured streams
 * are returned as raw buffers.
 */
export interface AsyncSpawnRawOutput {
    /** Process exit code, or `null` if it was terminated by a signal. */
    code: number | null;
    /** Raw standard output. Omitted when the stream produced no data. */
    stdout?: Buffer;
    /** Raw standard error. Omitted when the stream produced no data. */
    stderr?: Buffer;
}