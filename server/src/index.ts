/**
 * Application entrypoint: parses `process.argv` and dispatches to the matching
 * command registered in {@link commander}.
 */
import { commander } from './commander.js';

await commander.run();