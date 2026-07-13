import { Command } from '@bleed-believer/commander';

import { commander } from '@/commander.js';
import { styleText } from 'node:util';

/**
 * `help` command — prints the documentation for every registered command,
 * sourced from {@link commander.docs}: each command's path (with positional
 * `:param` segments highlighted) followed by its description.
 */
export const helpCommand = new Command({
    positionals: 'help :parts*',
    callback: () => ({
        async onInit(): Promise<void> {
            for (const { path, description } of commander.docs()) {
                const commandPath = path
                    .map(x => x.startsWith(':')
                        ?   styleText('yellow', x)
                        :   styleText('blueBright', x)
                    )
                    .join(' ');

                console.log(styleText('underline', 'Command') + ':', commandPath);
                console.log(description);
                console.log();

            }
        }
    })
})