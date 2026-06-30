export interface AxmMonitor {
    [K: string]: {
        value: string;
        type: string;
        unit: string;
        historic: boolean;
    };
}