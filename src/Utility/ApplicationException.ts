export class ApplicationException extends Error {
    public constructor(message?: string) {
        super(`[AppErr] ${message}`);
    }
}
