/**
 * Describes a single configuration option: where to read it from, its fallback,
 * and how to convert the raw `.env`/environment string into the final type `T`.
 *
 * When `T` is `string`, `transform` is optional (the raw value is already a
 * string); otherwise `transform` is required, since it is what parses the text
 * into a non-string value.
 *
 * @typeParam T - Final resolved type of the option.
 */
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