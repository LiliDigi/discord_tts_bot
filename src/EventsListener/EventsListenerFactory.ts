import { Client } from 'discord.js';

import { IEventsListener } from './IEventsListener';
import { ListenerClientReady } from './ClientReady/ListenerClientReady';
import { ListenerMessageCreate } from './MessageCreate/ListenerMessageCreate';

export class EventsListenerFactory implements IEventsListener {

    static registerd: boolean = false;

    public Register(client: Client): void {
        if (EventsListenerFactory.registerd) return;
        EventsListenerFactory.registerd = true;

        const registerTarget: IEventsListener[] = [
            new ListenerClientReady(),
            new ListenerMessageCreate(),
        ];

        for (const target of registerTarget) {
            target.Register(client);
        }
    }
}
