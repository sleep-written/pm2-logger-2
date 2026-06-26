/**
 * A class constructor used as both the DI token and the default factory.
 *
 * @typeParam T - Instance type produced by the constructor.
 * @typeParam A - Tuple of constructor argument types.
 */
export type Constructor<T, A extends any[]> = new(...args: A) => T;