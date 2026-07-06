export class PM2CLIError extends Error {
    #exitCode: number | null;
    get exitCode(): number | null {
        return this.#exitCode;
    }

    constructor(
        exitCode: number | null,
        message?: string,
        options?: ErrorOptions
    ) {
        super(message ?? 'Unknown error', options);
        this.#exitCode = exitCode;
    }
}