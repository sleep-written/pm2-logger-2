import { describe, it } from 'node:test';
import { toCamelCase } from './to-camel-case.js';

describe('toCamelCase', () => {
    it('convert boolean', (t: it.TestContext) => {
        const r = toCamelCase(true);
        t.assert.strictEqual(r, true);
    });

    it('convert number', (t: it.TestContext) => {
        const r = toCamelCase(666);
        t.assert.strictEqual(r, 666);
    });

    it('convert string', (t: it.TestContext) => {
        const r = toCamelCase('jajaja');
        t.assert.strictEqual(r, 'jajaja');
    });

    it('convert null', (t: it.TestContext) => {
        const r = toCamelCase(null);
        t.assert.strictEqual(r, null);
    });

    it('convert undefined', (t: it.TestContext) => {
        const r = toCamelCase(undefined);
        t.assert.strictEqual(r, undefined);
    });

    it('convert object', (t: it.TestContext) => {
        const r = toCamelCase({
            hola_mundo: 666,
            joder_chaval: true
        });

        t.assert.deepStrictEqual(r, {
            holaMundo: 666,
            joderChaval: true
        });
    });

    it('convert object with nested object', (t: it.TestContext) => {
        const r = toCamelCase({
            hola_mundo: 666,
            joder_chaval: {
                api_name: 'joder',
                api_port: 999
            }
        });

        t.assert.deepStrictEqual(r, {
            holaMundo: 666,
            joderChaval: {
                apiName: 'joder',
                apiPort: 999
            }
        });
    });

    it('convert array with objects', (t: it.TestContext) => {
        const r = toCamelCase([
            { api_prefix: 'v1', api_port: 8080 },
            { api_prefix: 'v2', api_port: 6666 },
        ]);

        t.assert.deepStrictEqual(r, [
            { apiPrefix: 'v1', apiPort: 8080 },
            { apiPrefix: 'v2', apiPort: 6666 },
        ]);
    });
});