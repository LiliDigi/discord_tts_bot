import { MakeMessageEmbed } from '../../../../Core/MakeMessageEmbed';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { EmbedBuilder } from '@discordjs/builders';

export class ExecBotCommandHelp extends ExecBotCommandBase {

    public Execute(): void {
        MakeMessageEmbed.MakeDefault(this.handler).then((embed: EmbedBuilder) => {

            let desc = new Array();

            desc.push("```bash");
            desc.push("\" 聞き専 \"");
            desc.push("$tts … 入っているチャンネルで読み上げを開始・終了します");
            desc.push("");
            desc.push("\" どこでも \"");
            desc.push("$wikipedia 単語 … 単語のWikipediaの解説を表示します");
            desc.push("$translate … 返信先の投稿を翻訳します");
            desc.push("$translate 文章 … 文章を翻訳します");
            desc.push("$translate XX YY … ISO639-1コードに基づき翻訳します");
            desc.push("$help … このヘルプがでます");
            desc.push("```");

            embed.setDescription(desc.join("\n"));

            this.handler.message.reply({
                embeds: [embed],
            })
        });
    }
}