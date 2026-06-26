import type { Constructor } from './interfaces/constructor.js';
import type { Provider } from './interfaces/provider.js';

/**
 * Minimal dependency-injection container keyed by class constructors.
 *
 * A constructor acts as both the token and its own default factory: calling
 * {@link Injector.inject} without a registered provider simply instantiates the
 * reference class. Registering a provider with {@link Injector.provide} lets you
 * swap in an alternative class or patch members onto the resulting instance.
 *
 * No decorators or reflection metadata are involved.
 *
 * @example
 * ```ts
 * const injector = new Injector();
 *
 * // No provider: instantiate the reference class itself.
 * const a = injector.inject(MyClass, ...args);
 *
 * // Class provider: instantiate a substitute (e.g. a subclass).
 * injector.provide(MyClass, MyOtherClass);
 *
 * // Value provider: override members on the created instance.
 * injector.provide(MyClass, { someMethod() {} });
 * ```
 */
export class Injector {
    #providers = new Map<
        Constructor<unknown, unknown[]>,
        Provider<unknown, unknown[]>
    >();

    /**
     * Bind a token to an alternative class that is instantiated in its place.
     *
     * @param ref - Constructor used as the DI token.
     * @param useClass - Class instantiated instead of `ref`.
     * @returns This injector, to allow chaining.
     */
    provide<T, A extends unknown[]>(ref: Constructor<T, A>, useClass: Constructor<T, A>): Injector;
    /**
     * Bind a token to a value whose members are copied onto each instance.
     *
     * @param ref - Constructor used as the DI token.
     * @param useValue - Object whose own property descriptors (string and symbol
     * keys, including getters/setters) are defined on the created instance.
     * @returns This injector, to allow chaining.
     */
    provide<T, A extends unknown[]>(ref: Constructor<T, A>, useValue: Partial<T>): Injector;
    provide(
        ref: Constructor<unknown, unknown[]>,
        use: Constructor<unknown, unknown[]> | object
    ): Injector {
        if (typeof use === 'function') {
            this.#providers.set(ref, { class: use as Constructor<unknown, unknown[]> });
        } else {
            this.#providers.set(ref, { value: use });
        }

        return this;
    }

    /**
     * Resolve a token into an instance.
     *
     * Instantiates the provider's class if one was registered, otherwise the
     * reference class itself. When a value provider is registered, its property
     * descriptors are then defined onto the new instance.
     *
     * @param ref - Constructor used as the DI token.
     * @param args - Arguments forwarded to the constructor.
     * @returns The resolved instance.
     */
    inject<T, A extends unknown[]>(ref: Constructor<T, A>, ...args: A): T;
    inject(ref: Constructor<unknown, unknown[]>, ...args: unknown[]): unknown {
        const provider = this.#providers.get(ref);
        const target = provider?.class
        ?   new provider.class(...args)
        :   new ref(...args);

        if (provider?.value) {
            const keys = [
                ...Object.getOwnPropertyNames(provider.value),
                ...Object.getOwnPropertySymbols(provider.value)
            ];

            keys
                .map(x => [ x, Object.getOwnPropertyDescriptor(provider.value, x)! ] as const)
                .forEach(([ k, v ]) => {
                    Object.defineProperty(target, k, v);
                });
        }

        return target;
    }
}