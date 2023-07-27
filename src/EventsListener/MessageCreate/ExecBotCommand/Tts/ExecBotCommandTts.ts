import { TtsControler } from 'Core/TtsControler';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { HandlerGuildMessage } from 'EventsListener/MessageCreate/HandlerGuildMessage';
import { MakeMessageEmbed } from 'Core/MakeMessageEmbed';
import { EmbedBuilder } from 'discord.js';
import { Defines } from 'Core/Defines';

enum EReplyReason {
    senderNotInChannel = 1,
    addConnection,
    removeConnection,
}

export class ExecBotCommandTts extends ExecBotCommandBase {

    execute(): void {
        if (!(this.handler instanceof HandlerGuildMessage)) return;

        const ttsControler = new TtsControler();

        const voiceChannelSender = this.handler.memberSender.voice.channel;
        const voiceChannelMe = this.handler.memberMe.voice.channel; // いないときにnullになる？

        // 既に自分が入っている時は、退出して終了
        if (voiceChannelMe) {
            ttsControler.RemoveConnection(voiceChannelMe, this.handler.channel);
            this.replyDispatcher(EReplyReason.removeConnection, this.handler);
            return;
        }

        // コマンド者が入っていない時は、メッセージ出して終了
        if (!voiceChannelSender) {
            this.replyDispatcher(EReplyReason.senderNotInChannel, this.handler);
            return;
        }

        // ボイスチャンネルに入る
        ttsControler.AddConnection(voiceChannelSender, this.handler.channel);
        this.replyDispatcher(EReplyReason.addConnection, this.handler);
        return;
    }

    private replyDispatcher(reason: EReplyReason, handler: HandlerGuildMessage): void {

        MakeMessageEmbed.MakeDefault(handler).then((embed: EmbedBuilder) => {

            embed.setAuthor({
                name: "テキスト読み上げ",
                iconURL: Defines.GUILD_L_ICON_URL
            })

            switch (reason) {
                case EReplyReason.senderNotInChannel: {
                    embed.setDescription("先にボイスチャンネルに入ってください");
                    break;
                }
                case EReplyReason.addConnection: {
                    embed.setDescription(`${handler.memberSender}が読み上げを開始しました`);
                    break;
                }
                case EReplyReason.removeConnection: {
                    embed.setDescription(`${handler.memberSender}が読み上げを終了しました`);
                    break;
                }
            }

            this.handler.message.reply({
                embeds: [embed],
            })
        });
    }
}
