import { styleText } from 'node:util';
import { Command } from '@bleed-believer/commander';

import { environment } from '@/environment.js';

/**
 * `setup` command — generates (or merges) the `.env` file at the application
 * root with the default option values, then prints its path.
 */
export const setupCommand = new Command({
    positionals: 'setup',
    description: [
        `Generate an env file with the default values on the`,
        `main application folder.`
    ].join('\n'),
    callback: () => ({
        async onInit(): Promise<void> {
            await environment.generate();
            console.log('File generated successfully at:');
            console.log(styleText('greenBright', `"${environment.path}"`));
        }
    })
})