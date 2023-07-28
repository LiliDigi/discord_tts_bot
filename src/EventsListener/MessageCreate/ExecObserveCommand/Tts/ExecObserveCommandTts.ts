import { GuildChannel, Message } from 'discord.js';
import { ExecObserveCommandBase } from '../ExecObserveCommandBase';
import { TtsControler } from 'Core/TtsControler';

export class ExecObserveCommandTts extends ExecObserveCommandBase {

    public Execute(): void {
        if (!this.handler.message.content) return;

        const text = this.convertTextForVc(this.handler.message);

        const ttsControler = new TtsControler();
        ttsControler.PlayTtsChannel(text, this.handler.channel);
    }

    private convertTextForVc(message: Message): string {

        const replaceArr = this.makeSedArray(message);
        const sededText = this.sedText(message.content, replaceArr);
        const replacedText = this.replaceText(sededText);

        return replacedText;
    }

    private sedText(text: string, replaceArr: [RegExp, string][]): string {
        for (const repl of replaceArr) text = text.replace(repl[0], ` ${repl[1]} `);
        return text;
    }

    private makeSedArray(message: Message): [RegExp, string][] {

        let replaceArr: [RegExp, string][] = [];

        replaceArr = this.makeSedMembers(message, replaceArr);
        replaceArr = this.makeSedChannels(message, replaceArr);
        replaceArr = this.makeSedRoles(message, replaceArr);

        return replaceArr;
    }


    private makeSedMembers(message: Message, replaceArr: [RegExp, string][]): [RegExp, string][] {

        const members = message.mentions.members?.values() ?? [];
        for (const member of members) {
            const regexp = new RegExp(`<@!??${member.id}>`, "g");
            replaceArr.push([regexp, member.displayName]);
        }

        return replaceArr;
    }

    private makeSedChannels(message: Message, replaceArr: [RegExp, string][]): [RegExp, string][] {

        const channels = message.mentions.channels.values();
        for (const channel of channels) {
            const regexp = new RegExp(`<#${channel.id}>`, "g");
            if (channel instanceof GuildChannel) {
                replaceArr.push([regexp, channel.name]);
            }
            else {
                replaceArr.push([regexp, "チャンネル"]); // guild のチャンネルでない場合、名前取得できない
            }
        }

        return replaceArr;
    }

    private makeSedRoles(message: Message, replaceArr: [RegExp, string][]): [RegExp, string][] {

        const roles = message.mentions.roles.values();
        for (const role of roles) {
            const regexp = new RegExp(`<@&${role.id}>`, "g");
            replaceArr.push([regexp, role.name]);
        }

        return replaceArr;
    }

    private replaceText(text: string): string {
        text = this.replaceTextEmojis(text);
        text = this.replaceTextChannels(text);
        return text;
    }

    private replaceTextEmojis(text: string): string {
        text = text.replace(/<a??:(\w+):\d+>/g, " $1 ");
        return text;
    }

    // clientから取得できなかったチャンネルのバカ避け用
    private replaceTextChannels(text: string): string {
        text = text.replace(/<#\d+>/g, " チャンネル ");
        return text;
    }
}