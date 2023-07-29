import { TtsControler } from 'Core/TtsControler';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { HandlerGuildMessage } from 'EventsListener/MessageCreate/HandlerGuildMessage';
import { MakeMessageEmbed } from 'Core/MakeMessageEmbed';
import { EmbedBuilder, VoiceState } from 'discord.js';
import { Defines } from 'Core/Defines';

enum EReplyReason {
    senderNotInChannel = 1,
    addConnection,
    removeConnection,
}

export class ExecBotCommandTts extends ExecBotCommandBase {

    public Execute(): void {
        if (!(this.handler instanceof HandlerGuildMessage)) return;

        const ttsControler = new TtsControler();

        const voiceSender = this.handler.memberSender.voice;
        const voiceMe = this.handler.memberMe.voice;

        // 既に自分が入っている時は、退出して終了
        if (this.isInVc(voiceMe)) {
            ttsControler.RemoveConnection(voiceMe, this.handler.channel);
            this.replyDispatcher(EReplyReason.removeConnection, this.handler);
            return;
        }

        // コマンド者が入っていない時は、メッセージ出して終了
        if (!this.isInVc(voiceSender)) {
            this.replyDispatcher(EReplyReason.senderNotInChannel, this.handler);
            return;
        }

        // ボイスチャンネルに入る
        ttsControler.AddConnection(voiceSender, this.handler.channel);
        this.replyDispatcher(EReplyReason.addConnection, this.handler);
        return;
    }

    private isInVc(voice: VoiceState): boolean {
        return (!!voice.channel);
    }

    private replyDispatcher(reason: EReplyReason, handler: HandlerGuildMessage): void {

        MakeMessageEmbed.MakeDefault(handler).then((embed: EmbedBuilder) => {

            embed.setAuthor({
                name: "テキスト読み上げ",
                iconURL: Defines.URL_GUILD_L_ICON
            })

            switch (reason) {
                case EReplyReason.senderNotInChannel: {
                    embed.setDescription("先にボイスチャンネルに入ってください");
                    embed.setColor("Yellow");
                    break;
                }
                case EReplyReason.addConnection: {
                    embed.setDescription(`${handler.memberSender}が読み上げを開始しました`);
                    embed.setColor("Green");
                    break;
                }
                case EReplyReason.removeConnection: {
                    embed.setDescription(`${handler.memberSender}が読み上げを終了しました`);
                    embed.setColor("Red");
                    break;
                }
            }

            handler.message.reply({
                embeds: [embed],
            })
        });
    }
}
