import { Defines } from 'Core/Defines';
import { MakeMessageEmbed } from 'Core/MakeMessageEmbed';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { HandlerGuildMessage } from 'EventsListener/MessageCreate/HandlerGuildMessage';

import { ControlRolePanel } from 'Core/ControlRolePanel';

enum EReplyReason {
    validateError = 1,
}

export class ExecBotCommandRolePanel extends ExecBotCommandBase {

    private validateCommand(): [boolean, string] {
        if (this.botCommandArgs.length % 2 !== 1) {
            return [true, "絵文字とロールは2つずつのセットにしてください"]
        }
        return [false, "Success"];
    }

    private createEmojiRolePair(): { [key: string]: string } {

        let emojiRolePair: { [key: string]: string } = {};
        for (let i = 1; i < this.botCommandArgs.length; i += 2) {
            emojiRolePair[this.botCommandArgs[i]] = this.botCommandArgs[i + 1];
        }

        return emojiRolePair;
    }

    private createDescription(emojiRolePair: { [key: string]: string }) {

        let description: string[] = [];
        for (const emoji_role of Object.keys(emojiRolePair)) {
            description.push(`${emoji_role}: <@&${emojiRolePair[emoji_role]}>`);
        }

        return description;
    }

    private createEmbed(description: string[]): EmbedBuilder {

        const embed = new EmbedBuilder()
            .setDescription(description.join("\n"));
        return embed;
    }

    private reactMsg(msgRolePanelPromise: Promise<Message>, emojiRolePair: { [key: string]: string; }) {
        msgRolePanelPromise.then((msgRolePanel) => {
            for (const emoji_role of Object.keys(emojiRolePair)) {
                msgRolePanel.react(emoji_role);
            }
        });
    }


    public Execute(): void {
        if (!(this.handler instanceof HandlerGuildMessage)) return;
        if (!(this.handler.channel instanceof TextChannel)) return;
        if (this.handler.userSender.id !== Defines.USER_ID_DEVELOPER) return;

        const controlRolePanel = new ControlRolePanel();

        const validateResult = this.validateCommand();
        if (validateResult[0]) {
            this.replyDispatcher(EReplyReason.validateError, validateResult[1], this.handler);
            return;
        }

        const emojiRolePair = this.createEmojiRolePair();
        const description = this.createDescription(emojiRolePair);
        const embed = this.createEmbed(description);
        const msgRolePanelPromise: Promise<Message> = this.handler.channel.send({ embeds: [embed] });
        this.reactMsg(msgRolePanelPromise, emojiRolePair);
        controlRolePanel.Add(msgRolePanelPromise, emojiRolePair);
        msgRolePanelPromise.then(() => {
            controlRolePanel.Init(this.handler.client);
        });
    }

    private replyDispatcher(reason: EReplyReason, errMsg: string, handler: HandlerGuildMessage): void {

        MakeMessageEmbed.MakeDefault(handler).then((embed: EmbedBuilder) => {

            embed.setAuthor({
                name: "ロールパネル",
                iconURL: Defines.URL_GUILD_L_ICON
            })

            switch (reason) {
                case EReplyReason.validateError: {
                    embed.setDescription(errMsg);
                    embed.setColor("Yellow");
                    break;
                }
            }

            handler.message.reply({
                embeds: [embed],
            })
        });
    }
}