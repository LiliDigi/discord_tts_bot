import { Channel, Message, User } from "discord.js";
import { IEventsHandler } from '../IEventsHandler';

export interface IHandlerMessage extends IEventsHandler {
    message: Message;
    channel: Channel;
    userSender: User;

    content: string;
}
