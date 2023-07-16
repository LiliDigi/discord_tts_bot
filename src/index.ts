import { Client } from 'discord.js';
import { ApplicationException } from 'Utility/ApplicationException';
import { Utility } from 'Utility/Utility'
import { Log } from 'Utility/Log';
import { EventsListenerFactory } from './EventsListener/EventsListenerFactory';
import { Defines } from 'Core/Defines';

class Main {

    constructor() { }

    public async StartBot() {
        this.configureLog4js();

        const client = new Client({ intents: Defines.GATEWAY_INTENTS_BITS });
        this.registerListener(client);
        await this.attemptLogin(client);
    }

    private configureLog4js() {
        Log.ConfigureSingletonLogger();
    }

    private registerListener(client: Client) {
        const factory = new EventsListenerFactory();
        factory.Register(client);
    }

    private async attemptLogin(client: Client) {

        for (let i = 0; ; i++) {
            let returnedToken = await client.login(Defines.DISCORD_BOT_TOKEN);
            Log.Debug(`${i + 1}回目のログイン試行…`)

            if (returnedToken === Defines.DISCORD_BOT_TOKEN) {
                Log.Debug(`ログイン成功`)
                break;
            }

            await Utility.Sleep(Defines.ATTEMPT_LOGIN_TIMEOUT_MS);
        }
    }

    public summarizeException(applicationException: ApplicationException) {
        console.log(applicationException);
    }
}

(async () => {
    const main = new Main();

    try {
        main.StartBot();

    } catch (exception) {

        if (exception instanceof ApplicationException) {
            main.summarizeException(exception);
        } else {
            console.log(exception);
        }

    } finally {

    }

})();
