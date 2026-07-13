import { notStrictEqual, strictEqual, ok } from 'node:assert';
import { describe, it } from 'node:test';

import { Injector } from './injector.js';

class Mathematics {
    random(): number {
        return Math.random();
    }
}

class MathematicsFake {
    random(): number {
        return 0.6666;
    }
}

describe('Injector class', () => {
    it('should instantiate the real class when nothing is provided', () => {
        const injector = new Injector();
        const mathematics = injector.inject(Mathematics);

        ok(mathematics instanceof Mathematics);
    });

    it('should cache the instance between injections', () => {
        const injector = new Injector();

        strictEqual(
            injector.inject(Mathematics),
            injector.inject(Mathematics)
        );
    });

    it('should resolve a provided value', () => {
        const injector = new Injector()
            .provide(Mathematics, { random: () => 0.6666 });

        strictEqual(injector.inject(Mathematics).random(), 0.6666);
    });

    it('should resolve a provided class', () => {
        const injector = new Injector()
            .provide(Mathematics, MathematicsFake);

        const mathematics = injector.inject(Mathematics);

        ok(mathematics instanceof MathematicsFake);
        strictEqual(mathematics.random(), 0.6666);
    });

    it('should return itself to allow chaining', () => {
        const injector = new Injector();

        strictEqual(
            injector.provide(Mathematics, MathematicsFake),
            injector
        );
    });

    it('should drop the cached instance when a provider is registered later', () => {
        const injector = new Injector();
        const real = injector.inject(Mathematics);

        injector.provide(Mathematics, MathematicsFake);
        const fake = injector.inject(Mathematics);

        notStrictEqual(fake, real);
        ok(fake instanceof MathematicsFake);
    });
});
