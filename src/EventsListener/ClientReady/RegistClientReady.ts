import { Client, Events } from 'discord.js';

import { IEventsListener } from '../IEventsListener';
import { HandlerClientReady } from './HandlerClientReady';

export class RegistClientReady implements IEventsListener {

    static registerd: boolean = false;

    public Register(client: Client): void {
        if (RegistClientReady.registerd) return;
        RegistClientReady.registerd = true;

        client.once(Events.ClientReady, (client: Client): void => {
            const handler = new HandlerClientReady(client);
            handler.ExecListenCommand();
        });
    }
}