import type { AxmOptionsApm } from './axm-options-apm.js';
import type { AxmOptionsMetrics } from './axm-options-metrics.js';

export interface AxmOptions {
    error: boolean;
    heapdump: boolean;
    'feature.profiler.heapsnapshot': boolean;
    'feature.profiler.heapsampling': boolean;
    'feature.profiler.cpuJs': boolean;
    latency: boolean;
    catchExceptions: boolean;
    profiling: boolean;
    metrics: AxmOptionsMetrics;
    standalone: false;
    moduleConf: object;
    apm: AxmOptionsApm;
    moduleName: string;
    moduleVersion: string;
}