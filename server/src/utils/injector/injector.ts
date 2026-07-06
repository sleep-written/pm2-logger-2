export class Injector {
    #instances = new Map<new() => object, object>();
    #providers = new Map<new() => object, {
        useClass?: new () => object;
        useValue?: object;
    }>();

    provide<T extends object>(constructor: new() => T, useClass: new () => Partial<T>): Injector;
    provide<T extends object>(constructor: new() => T, useValue: Partial<T>): Injector;
    provide<T extends object>(constructor: new() => T, input: Partial<T> | (new () => Partial<T>)) {
        this.#instances.delete(constructor);
        if (typeof input === 'function') {
            this.#providers.set(constructor, { useClass: input });
        } else {
            this.#providers.set(constructor, { useValue: input });
        }

        return this;
    }

    inject<T extends object>(constructor: new() => T): T {
        if (this.#instances.has(constructor)) {
            return this.#instances.get(constructor) as T;
        }

        const { useClass, useValue } = this.#providers.get(constructor) ?? {};
        if (useClass) {
            const target = new useClass();
            this.#instances.set(constructor, target);
            return target as T;
        }
        
        if (useValue) {
            this.#instances.set(constructor, useValue);
            return useValue as T;
        }

        const target = new constructor();
        this.#instances.set(constructor, target);
        return target;
    }
}