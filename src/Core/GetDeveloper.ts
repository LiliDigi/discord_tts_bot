import { Client, Guild, GuildMember, User } from "discord.js";
import { Defines } from "./Defines";

export class GetDeveloper {
    public static async GetUser(client: Client): Promise<User> {
        const guild = client.guilds.fetch(Defines.GUILD_ID_MINE)
        const memberDeveloper = (await guild).members.fetch(Defines.USER_ID_DEVELOPER);
        const userDeveloper = (await memberDeveloper).user;
        return userDeveloper;
    }
    public static async GetGuildMember(guild: Guild): Promise<GuildMember> {
        const memberDeveloper = guild.members.fetch(Defines.USER_ID_DEVELOPER);
        return memberDeveloper;
    }
}