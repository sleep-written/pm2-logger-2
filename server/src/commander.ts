import { Command, Commander } from '@bleed-believer/commander';

import { serverCommand } from './server/command.js';
import { helpCommand } from './help/command.js';
import { styleText } from 'node:util';

/**
 * Root CLI registry. Holds every supported command (`server`, `setup`, `help`)
 * plus a catch-all fallback that reports unknown input and points to `help`.
 */
export const commander = new Commander([
    serverCommand,
    helpCommand,
    // Fallback: any input not matched by the commands above lands here.
    new Command({
        positionals: ':args*',
        callback: c => ({
            onInit(): void {
                const command = styleText('red', c.positionals.args.join(' '));
                console.log(`The command [${command}] doesn't exists.`);
                console.log(`Type ${styleText('blueBright', 'help')} to read the docs.`);
            }
        })
    })
]);