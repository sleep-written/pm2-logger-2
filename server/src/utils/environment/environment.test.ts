import type { EnvironmentInject } from './interfaces/index.js';

import { describe, it } from 'node:test';
import { dirname } from 'node:path/posix';

import { Environment } from './environment.js';

class Inject implements EnvironmentInject {
    #file?: {
        path: string;
        content: string;
    };

    get file() {
        return this.#file;
    }

    process: EnvironmentInject['process'];

    constructor(o?: {
        file?: {
            path: string;
            data: NodeJS.ProcessEnv;
        };
        proc?: NodeJS.ProcessEnv;
    }) {
        this.process = { env: o?.proc ?? {} };
        if (o?.file) {
            this.#file = {
                path: o.file.path,
                content: Object
                    .entries(o.file.data)
                    .map(([ k, v ]) => `${k} = ${v}`)
                    .join('\n'),
            }
        }
    }

    stat(path: string): Promise<{ isFile(): boolean; }> {
        if (this.#file?.path !== path)  {
            throw new Error(`The location "${path}" doesn't exists`);
        }

        return Promise.resolve({ isFile: () => true });
    }

    mkdir(path: string, _: { force: true; recursive: true; }): Promise<string | undefined> {
        return Promise.resolve(path);
    }

    dirname(path: string): string {
        return dirname(path);
    }

    readFile(path: string, _: 'utf-8'): Promise<string> {
        if (this.#file?.path !== path) {
            throw new Error(`The file "${path}" doesn't exists`);
        }

        return Promise.resolve(this.#file.content);
    }

    writeFile(path: string, content: string, _: 'utf-8'): Promise<void> {
        this.#file = { path, content };
        return Promise.resolve();
    }
}

describe('Environment', () => {
    describe('Read env variables', () => {
        const inject = new Inject({
            file: {
                path: '/path/to/project/.env',
                data: {
                    APP_FOO: 'lol',
                    APP_BAR: '666'
                }
            },
            proc: {
                APP_FOO: 'ñee',
                APP_BAR: '999',
                APP_BAK: 'kek'
            }
        });

        const environment = new Environment('/path/to/project/.env', {
            foo: { envName: 'APP_FOO', default: 'kek',   },
            bar: { envName: 'APP_BAR', default: 111,    transform: v => parseInt(v) },
            bak: { envName: 'APP_BAK', default: 'iei',   },
            baz: { envName: 'APP_BAZ', default: false,  transform: v => v === 'true' },
        }, inject);

        it('Read "foo" -> from file', async (t: it.TestContext) => {
            const r = await environment.get('foo');
            t.assert.strictEqual(r, 'lol');
        });

        it('Read "bar" -> from file', async (t: it.TestContext) => {
            const r = await environment.get('bar');
            t.assert.strictEqual(r, 666);
        });

        it('Read "bak" -> from process env', async (t: it.TestContext) => {
            const r = await environment.get('bak');
            t.assert.strictEqual(r, 'kek');
        });

        it('Read "baz" -> from default value', async (t: it.TestContext) => {
            const r = await environment.get('baz');
            t.assert.strictEqual(r, false);
        });
    });

    describe('Generate file', () => {
        it('Create "/path/to/project/.env" successfully', async (t: it.TestContext) => {
            const inject = new Inject();
            const environment = new Environment('/path/to/project/.env', {
                foo: { envName: 'APP_FOO', default: 'aaa' },
                bar: { envName: 'APP_BAR', default: 'zzz' },
            }, inject);

            await environment.generate();
            t.assert.strictEqual(inject.file?.content, [
                `APP_FOO = aaa`,
                `APP_BAR = zzz`,
            ].join('\n'));
        });

        it('Create "/path/to/project/.env" failed (already exists)', async (t: it.TestContext) => {
            const inject = new Inject({
                file: {
                    path: '/path/to/project/.env',
                    data: {}
                }
            });

            const environment = new Environment('/path/to/project/.env', {
                foo: { envName: 'APP_FOO', default: 'aaa' },
                bar: { envName: 'APP_BAR', default: 'zzz' },
            }, inject);

            try {
                await environment.generate();
                t.assert.fail('The generate method must be fail on this test');
            } catch (err: any) {
                t.assert.strictEqual(
                    err.message,
                    `The file "${inject.file?.path}" already exists on disk. Cannot overwrite the file`
                )
            }
        });
    });
});