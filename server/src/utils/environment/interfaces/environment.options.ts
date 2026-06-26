import type { EnvironmentOptionsDescriptor } from './environment.options-descriptor.js';

/**
 * Map of option keys to their descriptors, passed to {@link Environment}.
 * Each key becomes a valid argument for {@link Environment.get}.
 */
export interface EnvironmentOptions {
    [k: string]: EnvironmentOptionsDescriptor<any>;
}