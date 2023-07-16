import { Message } from 'discord.js';
import { ExecObserveCommandBase } from '../ExecObserveCommandBase';
import { TtsControler } from 'Core/TtsControler';

export class ExecObserveCommandTts extends ExecObserveCommandBase {

    Execute(): void {
        if (!this.handler.message.content) return;

        const text = this.replaceText(this.handler.message);

        const ttsControler = new TtsControler();
        ttsControler.PlayTtsChannel(text, this.handler.channel);
    }

    private replaceText(message: Message): string {

        let text = message.content;
        const repl_ar = [];

        const members = message.mentions.members?.values() ?? [];
        for (const member of members) {
            const regexp = new RegExp(`<@!??${member.id}>`, "g");
            repl_ar.push([regexp, member.displayName]);
        }

        // const channels = message.mentions.channels.values();
        // for (const channel of channels) {
        //     const regexp = new RegExp(`<#${channel.id}>`, "g");
        //     repl_ar.push([regexp, channel.]);
        // } // そのうちなおす

        const roles = message.mentions.roles.values();
        for (const role of roles) {
            const regexp = new RegExp(`<@&${role.id}>`, "g");
            repl_ar.push([regexp, role.name]);
        }

        for (const repl of repl_ar) text = text.replace(repl[0], ` ${repl[1]} `);
        text = text.replace(/<a??:(\w+):\d{18}>/g, " $1 ");
        return text;
    }
}