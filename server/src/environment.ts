import { Environment } from '@utils/environment';
import { resolve } from 'node:path';

const environmentPath = resolve(
    import.meta.dirname,
    '../../.env'
);

export const environment = new Environment(environmentPath, {
    port: {
        default: 8080,
        envName: 'PM2_LOGGER_PORT',
        transform: v => parseInt(v)
    }
});