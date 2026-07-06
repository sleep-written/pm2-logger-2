import { Injector } from './injector.js';

class Mathematics {
    random(): number {
        return Math.random();
    }
}

const injector = new Injector().provide(Mathematics, { random: () => 0.6666 });

class Program {
    #mathematics = injector.inject(Mathematics);

    show(): string {
        const random = this.#mathematics.random();
        return `value: ${random}`;
    }
}

// Debería mostrar "value: 0.6666"
const program = new Program();
console.log(program.show());