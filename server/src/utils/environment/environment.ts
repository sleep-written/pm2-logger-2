import type { EnvironmentInject, EnvironmentOptions, EnvironmentOptionsDescriptor } from './interfaces/index.js';

import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { dirname } from 'node:path';

/**
 * Typed accessor and generator for `.env`-based configuration.
 *
 * Values are resolved with the following precedence: the project's `.env` file,
 * then the process environment, then the option's declared `default`. Each
 * option declares how its raw string is transformed into the final type.
 *
 * @typeParam O - The shape of the declared options.
 *
 * @example
 * ```ts
 * const env = new Environment(path, {
 *     port: { default: 8080, envName: 'PM2_LOGGER_PORT', transform: v => parseInt(v) },
 * });
 * const port: number = await env.get('port');
 * ```
 */
export class Environment<O extends EnvironmentOptions> {
    #injected: Required<EnvironmentInject>;
    #options: O;

    #path: string;
    /** Absolute path of the `.env` file backing this instance. */
    get path(): string {
        return this.#path;
    }

    /**
     * @param path - Absolute path to the `.env` file.
     * @param options - Declared options keyed by name.
     * @param inject - Optional I/O overrides (see {@link EnvironmentInject}).
     */
    constructor(path: string, options: O, inject?: EnvironmentInject) {
        this.#path = path;
        this.#options = options;
        this.#injected = {
            writeFile:  inject?.writeFile?.bind(inject) ??  writeFile,
            readFile:   inject?.readFile?.bind(inject)  ??  readFile,
            dirname:    inject?.dirname?.bind(inject)   ??  dirname,
            mkdir:      inject?.mkdir?.bind(inject)     ??  mkdir,
            stat:       inject?.stat?.bind(inject)      ??  stat,

            process:    inject?.process ??  process,
        };
    }

    /**
     * Reads and parses the `.env` file, or returns `undefined` if it cannot be
     * read (e.g. it does not exist yet).
     */
    async #getEnvFile(): Promise<NodeJS.ProcessEnv | undefined> {
        let content: string | undefined;

        try {
            content = await this.#injected.readFile(this.#path, 'utf-8');
        } finally {
            return typeof content === 'string'
            ?   parseEnv(content)
            :   undefined;
        }
    }

    /**
     * Resolves an option's value, applying its `transform` when present.
     *
     * Precedence: `.env` file → `process.env` → option `default`.
     *
     * @param key - One of the declared option keys.
     * @returns The resolved, transformed value.
     * @throws If `key` is not a declared option.
     */
    async get<
        K extends keyof O,
        V extends O[K] extends EnvironmentOptionsDescriptor<infer U>
        ?   U
        :   never
    >(key: K): Promise<V>;
    async get(key: string): Promise<unknown> {
        const envFile = await this.#getEnvFile();
        const option = this.#options[key];
        if (!option) {
            throw new Error(`The key "${key}" doesn't exists inside "Environment Options" instance`);
        }

        const value = (
            envFile?.[option.envName] ??
            this.#injected.process.env[option.envName]
        );

        return typeof value === 'string'
        ?   option.transform?.(value) ?? value
        :   option.default;
    }

    /**
     * Writes the `.env` file from the declared defaults, merging in any values
     * already present in the existing file so user edits are preserved (the
     * operation is idempotent). Creates the target directory if missing.
     */
    async generate(): Promise<void> {
        const variables: NodeJS.ProcessEnv = {};
        Object
            .values(this.#options)
            .map(v => variables[v.envName] = v.default);

        Object
            .entries(await this.#getEnvFile() ?? {})
            .map(([ k, v ]) => variables[k] = v)

        const location = this.#injected.dirname(this.#path);
        const content = Object
            .entries(variables)
            .map(([ k, v ]) => `${k} = ${v}`)
            .join('\n');

        await this.#injected.mkdir(location, { force: true, recursive: true });
        return this.#injected.writeFile(this.#path, content, 'utf-8');
    }
}