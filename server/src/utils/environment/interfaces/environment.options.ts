import type { EnvironmentOptionsDescriptor } from './environment.options-descriptor.js';

export interface EnvironmentOptions {
    [k: string]: EnvironmentOptionsDescriptor<any>;
}