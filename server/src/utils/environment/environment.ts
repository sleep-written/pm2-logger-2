import type { EnvironmentInject, EnvironmentOptions, EnvironmentOptionsDescriptor } from './interfaces/index.js';

import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { dirname } from 'node:path';

export class Environment<O extends EnvironmentOptions> {
    #injected: Required<EnvironmentInject>;
    #options: O;
    #path: string;

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

    async #getEnvFile(): Promise<NodeJS.ProcessEnv | undefined> {
        const content = await this.#injected
            .readFile(this.#path, 'utf-8')
            .catch(_ => undefined);

        return typeof content === 'string'
        ?   parseEnv(content)
        :   undefined;
    }

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

    async generate(): Promise<void> {
        let stats: { isFile: () => boolean; };
        try {
            stats = await this.#injected.stat(this.#path);
        } catch {
            stats = { isFile: () => false };
        }

        if (stats.isFile()) {
            throw new Error(`The file "${this.#path}" already exists on disk. Cannot overwrite the file`);
        }

        const location = this.#injected.dirname(this.#path);
        const content = Object
            .values(this.#options)
            .map(v => `${v.envName} = ${v.default}`)
            .join('\n');

        await this.#injected.mkdir(location, { force: true, recursive: true });
        return this.#injected.writeFile(this.#path, content, 'utf-8');
    }
}