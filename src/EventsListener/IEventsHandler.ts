import { Client, User } from "discord.js";

export interface IEventsHandler {
    client: Client;
    userMe: User;
}
