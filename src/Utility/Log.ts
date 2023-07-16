import * as Log4js from "log4js";
export class Log {

    private static loggerLevel: string = 'all';

    private static logger: Log4js.Logger;
    private static initialized: boolean = false;

    public static ConfigureSingletonLogger(): void {
        if (this.initialized) {
            return;
        }
        // Log4js.configure( 'aaa' ); // 脱default設定はここでする
        this.logger = Log4js.getLogger();
        this.logger.level = this.loggerLevel;
        this.initialized = true;
    }

    public static Trace(message: string): void {
        this.ConfigureSingletonLogger();
        this.logger?.trace(message);
    }

    public static Debug(message: string): void {
        this.ConfigureSingletonLogger();
        this.logger?.debug(message);
    }

    public static Info(message: string): void {
        this.ConfigureSingletonLogger();
        this.logger?.info(message);
    }
}