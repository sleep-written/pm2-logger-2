/**
 * Converts a single `snake_case` string literal into its `camelCase`
 * equivalent, mirroring the runtime `/_\w/g` replacement: every underscore
 * followed by a character drops the underscore and uppercases that character.
 */
type SnakeToCamel<S extends string> =
    S extends `${infer Head}_${infer Tail}`
        ? Tail extends `${infer First}${infer Rest}`
            ? `${Head}${Uppercase<First>}${SnakeToCamel<Rest>}`
            : `${Head}_`
        : S;

/**
 * Recursively maps a value to its `camelCase` counterpart: object keys are
 * rewritten with {@link SnakeToCamel}, arrays preserve their structure, and
 * primitives are returned as-is.
 */
type CamelCase<T> =
    T extends readonly unknown[]
        ? { [K in keyof T]: CamelCase<T[K]> }
        : T extends object
            ? { [K in keyof T as K extends string ? SnakeToCamel<K> : K]: CamelCase<T[K]> }
            : T;

export function toCamelCase<const T>(input: T): CamelCase<T>;
export function toCamelCase(input: unknown): unknown {
    switch (true) {
        case Array.isArray(input): {
            const output: unknown[] = [];
            for (const inputItem of input) {
                const outputItem = toCamelCase(inputItem);
                output.push(outputItem);
            }

            return output;
        }

        case input && typeof input === 'object': {
            const output: Record<string, unknown> = {};
            Object
                .entries(input)
                .map(([ k, v ]) => [
                    k.replace(
                        /_\w/g,
                        v => v.slice(1).toUpperCase()
                    ),
                    toCamelCase(v)
                ] as const)
                .forEach(([ k, v ]) => output[k] = v);

            return output;
        }

        default: {
            return input;
        }
    }
}
