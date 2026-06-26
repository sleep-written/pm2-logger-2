import { Environment } from '@utils/environment';
import { resolve } from 'node:path';

const environmentPath = resolve(
    import.meta.dirname,
    '../../.env'
);

/**
 * Application-wide {@link Environment} instance.
 *
 * Backed by the `.env` file at the project root. Declares the configurable
 * options consumed across the app.
 *
 * - `port`: web server port. Env var `PM2_LOGGER_PORT`, defaults to `8080`.
 */
export const environment = new Environment(environmentPath, {
    port: {
        default: 8080,
        envName: 'PM2_LOGGER_PORT',
        transform: v => parseInt(v)
    }
});