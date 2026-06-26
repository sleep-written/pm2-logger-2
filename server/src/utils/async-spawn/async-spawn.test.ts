import { describe, it } from 'node:test';
import { asyncSpawn } from './async-spawn.js';

describe('asyncSpawn', () => {
    const args = process.platform === 'win32'
    ?   [ '-Name' ]
    :   undefined;

    it('Run "ls" here', async (t: it.TestContext) => {
        const { code, stdout, stderr } = await asyncSpawn('ls', {
            cwd: import.meta.dirname,
            args
        });

        t.assert.strictEqual(code, 0);
        t.assert.strictEqual(
            stdout?.toString('utf-8')?.trim(),
            `async-spawn.test.ts\nasync-spawn.ts\nindex.ts\ninterfaces`
        );

        t.assert.strictEqual(
            stderr?.toString('utf-8')?.trim(),
            undefined
        );
    });
    
    it('Run "ls" here, text output', async (t: it.TestContext) => {
        const { code, stdout, stderr } = await asyncSpawn('ls', {
            cwd: import.meta.dirname,
            args,
            encoding: 'utf-8'
        });

        t.assert.strictEqual(code, 0);
        t.assert.strictEqual(
            stdout,
            `async-spawn.test.ts\nasync-spawn.ts\nindex.ts\ninterfaces`
        );

        t.assert.strictEqual(
            stderr,
            undefined
        );
    });
});