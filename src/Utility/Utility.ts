export class Utility {
    private constructor() { }
    public static Sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
}
