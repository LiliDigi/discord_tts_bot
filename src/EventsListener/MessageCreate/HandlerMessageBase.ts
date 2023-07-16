import { Channel, Client, Message, User } from 'discord.js';
import { IHandlerMessage } from './IHandlerMessage';

export abstract class HandlerMessageBase implements IHandlerMessage {

    client: Client;
    channel: Channel;
    message: Message;
    userSender: User;
    userMe: User;

    content: string;

    constructor(message: Message) {
        this.client = message.client;
        this.channel = message.channel;
        this.message = message;
        this.userSender = message.author;
        this.userMe = this.client.user!; // ログイン済みのため、取得保証

        this.content = this.message.content;
    }

    abstract ExecListenCommand(): void;
}