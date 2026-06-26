/**
 * Result of {@link asyncSpawn} when an `encoding` is provided: captured streams
 * are decoded and trimmed into strings.
 */
export interface AsyncSpawnOutput {
    /** Process exit code, or `null` if it was terminated by a signal. */
    code: number | null;
    /** Decoded standard output. Omitted when the stream produced no data. */
    stdout?: string;
    /** Decoded standard error. Omitted when the stream produced no data. */
    stderr?: string;
}