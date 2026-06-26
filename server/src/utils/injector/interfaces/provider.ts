/**
 * A registered binding for a DI token.
 *
 * Exactly one of {@link Provider.class} or {@link Provider.value} is set,
 * matching the two overloads of {@link Injector.provide}.
 *
 * @typeParam T - Instance type produced for the token.
 * @typeParam A - Tuple of constructor argument types.
 */
export interface Provider<T, A extends unknown[]> {
    /** Alternative class instantiated in place of the token's own constructor. */
    class?: new(...a: A) => T;
    /** Object whose property descriptors are copied onto the created instance. */
    value?: T;
}