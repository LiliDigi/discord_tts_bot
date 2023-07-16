import { Client } from "discord.js";

export interface IEventsListener {
    Register(client: Client): void;
}
