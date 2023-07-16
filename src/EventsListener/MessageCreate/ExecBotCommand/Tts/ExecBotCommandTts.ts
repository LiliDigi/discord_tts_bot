import { TtsControler } from 'Core/TtsControler';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { HandlerGuildMessage } from 'EventsListener/MessageCreate/HandlerGuildMessage';
import { MakeMessageEmbed } from 'Core/MakeMessageEmbed';
import { EmbedBuilder } from 'discord.js';

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
            this.replyDispatcher(EReplyReason.removeConnection);
            return;
        }

        // コマンド者が入っていない時は、メッセージ出して終了
        if (!voiceChannelSender) {
            this.replyDispatcher(EReplyReason.senderNotInChannel);
            return;
        }

        // ボイスチャンネルに入る
        ttsControler.AddConnection(voiceChannelSender, this.handler.channel);
        this.replyDispatcher(EReplyReason.addConnection);
        return;
    }

    private replyDispatcher(reason: EReplyReason): void {

        MakeMessageEmbed.MakeDefault(this.handler).then((embed: EmbedBuilder) => {

        });
    }
}
