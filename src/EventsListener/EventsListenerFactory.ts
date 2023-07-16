import { Client } from 'discord.js';

import { IEventsListener } from './IEventsListener';
import { RegistClientReady } from './ClientReady/RegistClientReady';
import { RegistMessageCreate } from './MessageCreate/RegistMessageCreate';

export class EventsListenerFactory implements IEventsListener {

    static registerd: boolean = false;

    public Register(client: Client): void {
        if (EventsListenerFactory.registerd) return;
        EventsListenerFactory.registerd = true;

        const registerTarget: IEventsListener[] = [
            new RegistClientReady(),
            new RegistMessageCreate(),
        ];

        for (const target of registerTarget) {
            target.Register(client);
        }
    }
}
