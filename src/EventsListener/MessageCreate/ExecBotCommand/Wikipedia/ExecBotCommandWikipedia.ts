import { IHandlerMessage } from 'EventsListener/MessageCreate/IHandlerMessage';
import { MakeMessageEmbed } from '../../../../Core/MakeMessageEmbed';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import { EmbedBuilder } from '@discordjs/builders';
import Axios, { AxiosInstance } from 'axios';
import Clone from 'clone';


export class ExecBotCommandWikipedia extends ExecBotCommandBase {

    private wordTarget: string;

    constructor(botCommandWithArgs: string[], handler: IHandlerMessage) {
        super(botCommandWithArgs, handler);
        this.wordTarget = this.botCommandWithArgs.slice(1).join(" ");
    }

    public Execute(): void {

        const axios = this.createAxios(this.wordTarget);

        axios.get('/').then((response) => {
            const pages = response.data.query.pages;
            this.replyDispatcher(pages, this.handler);
        }).catch((reason) => {
            console.log(reason);
        });
    }

    private createAxios(wordTarget: string): AxiosInstance {
        let request = {
            baseURL: 'https://ja.wikipedia.org/w/api.php',
            params: {
                format: "json",
                action: "query",
                prop: "extracts",
                exintro: "",
                explaintext: "",
                redirects: 1,
            }
        }

        if (this.wordTarget) {
            Object.assign(request.params, { titles: wordTarget });
        }
        else { // ワードがなければおまかせ表示
            Object.assign(request.params, { generator: "random" });
            Object.assign(request.params, { grnnamespace: 0 });
        }

        const axios = Axios.create(request);
        return axios;
    }

    private replyDispatcher(pages: any, handler: IHandlerMessage): void {
        MakeMessageEmbed.MakeDefault(this.handler).then((embedOrg: EmbedBuilder) => {

            const embeds: EmbedBuilder[] = [];

            for (const id in pages) {
                let embed = Clone(embedOrg);

                embed.setAuthor({
                    name: 'Wikipedia',
                    iconURL: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png'
                });
                embed.setColor([0x97, 0x9C, 0x9F]);
                embed.setTitle(pages[id].title);
                embed.setURL(`https://ja.wikipedia.org/wiki/${pages[id].title.replace(/ /g, "_")}`)
                embed.setDescription(pages[id].extract ?? "ウィキペディアには現在この名前の項目はありません。");

                embeds.push(embed);
            }

            this.handler.message.reply({ embeds });

        });
    }
}