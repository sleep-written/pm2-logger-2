export type EnvironmentOptionsDescriptor<T> = T extends string
?   {
        envName: string;
        default: string;
        transform?: (v: string) => T;
    }
:   {
        envName: string;
        default: T;
        transform: (v: string) => T;
    };