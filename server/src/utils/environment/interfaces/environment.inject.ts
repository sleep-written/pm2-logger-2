/**
 * Injectable I/O dependencies for {@link Environment}.
 *
 * Every member is optional: production uses the real `node:fs/promises` /
 * `node:path` / `process` implementations, while tests inject fakes (e.g. an
 * in-memory file) to keep the unit free of real filesystem access.
 */
export interface EnvironmentInject {
    /** Source of environment variables. Defaults to the global `process`. */
    process?: { env: NodeJS.ProcessEnv; };

    /** Stats a path; used to probe for an existing file. */
    stat?(
        path: string
    ): Promise<{
        isFile(): boolean;
    }>;

    /** Recursively creates the directory that will hold the `.env` file. */
    mkdir?(
        path: string,
        opts: {
            force: true;
            recursive: true;
        }
    ): Promise<string | undefined>;

    /** Returns the directory portion of a path. */
    dirname?(
        path: string
    ): string;

    /** Reads the `.env` file contents as UTF-8 text. */
    readFile?(
        path: string,
        encoding: 'utf-8'
    ): Promise<string>;

    /** Writes the generated `.env` file as UTF-8 text. */
    writeFile?(
        path: string,
        content: string,
        encoding: 'utf-8'
    ): Promise<void>;
}