import { GatewayIntentBits } from "discord.js";

export namespace Defines {
    export const APP_VERSION: string | undefined = process.env.npm_package_version;
    export const DISCORD_BOT_TOKEN: string = process.env.DISCORD_BOT_TOKEN!; // 実行時エラーを許容
    export const GUILD_ID_MINE: string = process.env.GUILD_ID_MINE!; // 実行時エラーを許容
    export const GUILD_L_ICON_URL: string = process.env.GUILD_L_ICON_URL!; // 実行時エラーを許容
    export const USER_ID_DEVELOPER: string = process.env.USER_ID_DEVELOPER!; // 実行時エラーを許容
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
}