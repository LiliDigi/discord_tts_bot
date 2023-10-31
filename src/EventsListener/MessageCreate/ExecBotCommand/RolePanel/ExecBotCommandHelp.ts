import { MakeMessageEmbed } from '../../../../Core/MakeMessageEmbed';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { EmbedBuilder } from '@discordjs/builders';

export class ExecBotCommandRolePanel extends ExecBotCommandBase {

    public Execute(): void {

        if (this.botCommandWithArgs.length % 2 !== 1) return user_data.channel.send("絵文字とロールは2つずつのセットにしてください");

        const emoji_role_pair = {};

        for (let i = 1; i < user_data.cont_ar.length; i += 2) emoji_role_pair[user_data.cont_ar[i]] = user_data.cont_ar[i + 1];

        const description = [];

        for (const emoji_role of Object.keys(emoji_role_pair)) {
            await description.push(`${emoji_role}: <@&${emoji_role_pair[emoji_role]}>`);
        }

        const embed = new discord.MessageEmbed()
            .setDescription(description.join("\n"))

        const send = await user_data.channel.send(embed);

        for (const emoji_role of Object.keys(emoji_role_pair)) {
            send.react(emoji_role);
        }

        let data = await JSON.parse(fs.readFileSync("json/role_panel.json", 'utf8'));

        data[`${user_data.guild.id}_${user_data.channel.id}_${send.id}`] = emoji_role_pair;

        await fs.writeFile("json/role_panel.json", JSON.stringify(data, null, ' '), (err) => {
            if (err) console.log(`error!::${err}`);
        });

        this.role_panel_cron(user_data.client, data);


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