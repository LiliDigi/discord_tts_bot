import { Client, Events, Message } from 'discord.js';

import { IEventsListener } from '../IEventsListener';
import { HandlerMessageBase } from './HandlerMessageBase';
import { HandlerDirectMessage } from './HandlerDirectMessage';
import { HandlerGuildMessage } from './HandlerGuildMessage';
import { ApplicationException } from 'Utility/ApplicationException';

export class RegistMessageCreate implements IEventsListener {

    static registerd: boolean = false;

    public Register(client: Client): void {
        if (RegistMessageCreate.registerd) return;
        RegistMessageCreate.registerd = true;

        client.on(Events.MessageCreate, (message: Message) => {
            if (this.disallowProcess(message)) return;
            const handler = this.makeHandlerMessage(message);
            handler.ExecListenCommand();
        });
    }

    private makeHandlerMessage(message: Message): HandlerMessageBase {
        if (this.isDM(message)) {
            return new HandlerDirectMessage(message);
        }
        else if (this.inGuild(message)) {
            return new HandlerGuildMessage(message);
        }
        else {
            throw new ApplicationException(`Unkown Message Type: ${message.type}`);
        }
    }

    private disallowProcess(message: Message): boolean {
        if (message.author.bot) return true;
        return false;
    }

    private isDM(message: Message): boolean {
        return message.channel.constructor.name === "DMChannel";
    }

    private inGuild(message: Message): boolean {
        return message.guild !== null;
    }
}
