import { describe, it } from 'node:test';
import { Injector } from './injector.js';

describe('Injector', () => {
    interface ConsoleObject {
        log(...args: unknown[]): void;
        info(...args: unknown[]): void;
        error(...args: unknown[]): void;
    }

    class Console {
        #data = new Map<string, string[]>();

        #stdin(logLevel: string, ...args: unknown[]): void {
            if (!this.#data.has(logLevel)) {
                this.#data.set(logLevel, []);
            }

            this.#data.get(logLevel)!.push(args
                .map(x => `${x}`)
                .join(' ')
            );
        }

        get(): Record<string, string[]> {
            const data: Record<string, string[]> = {};
            for (const [ k, v ] of this.#data.entries()) {
                data[k] = v;
            }

            return data;
        }
        
        log(...args: unknown[]): void {
            this.#stdin('log', ...args);
        }
        
        info(...args: unknown[]): void {
            this.#stdin('info', ...args);
        }
        
        error(...args: unknown[]): void {
            this.#stdin('error', ...args);
        }
    }

    class Player {
        protected console: ConsoleObject;

        #name: string;
        get name(): string {
            return this.#name;
        }

        #alive = true;
        get alive(): boolean {
            return this.#alive;
        }

        constructor(name: string, consoleInject?: ConsoleObject) {
            this.#name = name;
            this.console = consoleInject ?? console;
        }

        kill(other: Player): void {
            if (!this.#alive) {
                this.console.error(`The player "${this.#name}" is already died`);
            } else {
                other.#alive = false;
                this.console.info(`The player "${this.#name}" has killed "${other.#name}"`);
            }
        }
    }

    it('Create an inyector, and instance a person without a provider', (t: it.TestContext) => {
        const console = new Console();
        const injector = new Injector();
        const playerOne = injector.inject(Player, 'Pendejo', console);
        const playerTwo = injector.inject(Player, 'Ijoeputa', console);

        playerOne.kill(playerTwo);
        playerTwo.kill(playerOne);

        t.assert.strictEqual(playerOne.alive, true);
        t.assert.strictEqual(playerTwo.alive, false);
        t.assert.deepStrictEqual(console.get(), {
            info: [
                `The player "Pendejo" has killed "Ijoeputa"`
            ],
            error: [
                `The player "Ijoeputa" is already died`
            ]
        });
    });

    it('Create an inyector, and instance a person with a class provider', (t: it.TestContext) => {
        const console = new Console();
        const injector = new Injector();
        const playerOne = injector.inject(Player, 'Pendejo', console);

        // Provide a custom pacifist value
        injector.provide(Player, class extends Player {
            kill(): void {
                this.console.error(`The player "${this.name}" doesn't want to kill other players`);
            }
        });

        const playerTwo = injector.inject(Player, 'Pussy', console);

        playerTwo.kill(playerOne);
        playerOne.kill(playerTwo);

        t.assert.strictEqual(playerOne.alive, true);
        t.assert.strictEqual(playerTwo.alive, false);
        t.assert.deepStrictEqual(console.get(), {
            info: [
                `The player "Pendejo" has killed "Pussy"`
            ],
            error: [
                `The player "Pussy" doesn't want to kill other players`
            ]
        });
    });

    it('Create an inyector, and instance a person with a value provider', (t: it.TestContext) => {
        const console = new Console();
        const injector = new Injector();
        const playerOne = injector.inject(Player, 'Pendejo', console);

        // Provide a custom pacifist value
        injector.provide(Player, {
            kill(this: Player) {
                this.console.error(`The player "${this.name}" doesn't want to kill other players`);
            },
        });

        const playerTwo = injector.inject(Player, 'Pussy', console);

        playerTwo.kill(playerOne);
        playerOne.kill(playerTwo);

        t.assert.strictEqual(playerOne.alive, true);
        t.assert.strictEqual(playerTwo.alive, false);
        t.assert.deepStrictEqual(console.get(), {
            info: [
                `The player "Pendejo" has killed "Pussy"`
            ],
            error: [
                `The player "Pussy" doesn't want to kill other players`
            ]
        });
    });
});