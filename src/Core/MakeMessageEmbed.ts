import { EmbedBuilder } from 'discord.js';
import { IHandlerMessage } from '../EventsListener/MessageCreate/IHandlerMessage';
import { GetDeveloper } from 'Core/GetDeveloper';
import { HandlerGuildMessage } from '../EventsListener/MessageCreate/HandlerGuildMessage';
import { HandlerDirectMessage } from '../EventsListener/MessageCreate/HandlerDirectMessage';
import { ApplicationException } from '../Utility/ApplicationException';

export class MakeMessageEmbed {
    public static async MakeDefault(handler: IHandlerMessage): Promise<EmbedBuilder> {

        if (handler instanceof HandlerGuildMessage) {
            return this.makeGuildDefault(handler);
        }
        else if (handler instanceof HandlerDirectMessage) {
            return this.makeDmDefault(handler);
        }
        else {
            throw new ApplicationException(`Unknown handler instance: ${handler}`)
        }
    }
    private static async makeDmDefault(handler: HandlerDirectMessage): Promise<EmbedBuilder> {

        const userDeveloper = await GetDeveloper.GetUser(handler.client);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: handler.userMe.username + " コマンドヘルプ",
                iconURL: handler.userMe.avatarURL() ?? undefined
            })
            .setColor("Random")
            .setFooter({
                text: `${handler.userMe.username} by ${userDeveloper.username}`,
                iconURL: userDeveloper.avatarURL() ?? undefined
            })
            .setTimestamp(handler.message.createdTimestamp);

        return embed;
    }

    private static async makeGuildDefault(handler: HandlerGuildMessage): Promise<EmbedBuilder> {

        const memberDeveloper = await GetDeveloper.GetGuildMember(handler.guild);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: handler.memberMe.displayName + " コマンドヘルプ",
                iconURL: handler.memberMe.avatarURL() ?? undefined
            })
            .setColor("Random")
            .setFooter({
                text: `${handler.memberMe.displayName} by ${memberDeveloper.displayName}`,
                iconURL: memberDeveloper.avatarURL() ?? undefined
            })
            .setTimestamp(handler.message.createdTimestamp);

        return embed;
    }
}