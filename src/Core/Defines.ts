import { GatewayIntentBits } from "discord.js";
import { Log } from 'Utility/Log';

export namespace Defines {
    export const APP_VERSION: string = process.env.npm_package_version!;
    export const DISCORD_BOT_TOKEN: string = process.env.DISCORD_BOT_TOKEN!;
    export const GUILD_ID_MINE: string = process.env.GUILD_ID_MINE!; 
    export const URL_GUILD_L_ICON: string = process.env.URL_GUILD_L_ICON!;
    export const USER_ID_DEVELOPER: string = process.env.USER_ID_DEVELOPER!;
    export const BOT_COMMAND_PREFIX: string = '$';
    export const ATTEMPT_LOGIN_TIMEOUT_MS: number = 5000;
    export const GATEWAY_INTENTS_BITS: GatewayIntentBits[] = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ];

    export function HasUndefinedValues(): boolean {
        const keys = Object.keys(Defines) as (keyof typeof Defines)[];
        let hasUndefined = false;
        for (const key of keys) {
            if (Defines[key] === undefined) {
                Log.Warn(`Defines.${key} is undefined.`);
                hasUndefined = true;
            }
        }
        return hasUndefined;
    }
}
