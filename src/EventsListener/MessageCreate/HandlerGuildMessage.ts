import { Guild, GuildMember, Message } from 'discord.js';
import { Defines } from 'Core/Defines';

import { HandlerMessageBase } from './HandlerMessageBase';
import { ClassifyBotCommand } from './ExecBotCommand/ClassifyBotCommand';
import { IExecBotCommand } from './ExecBotCommand/IExecBotCommand';
import { DistributeMessageObserver } from './ExecObserveCommand/DistributeMessageObserver';

export class HandlerGuildMessage extends HandlerMessageBase {

    guild: Guild;
    memberSender: GuildMember;
    memberMe: GuildMember;

    contentSplitedArray: string[];

    constructor(message: Message) {
        super(message);
        this.contentSplitedArray = message.content.split(" ").filter(Boolean);

        // 以下、上位で GuildMessage 保証
        this.guild = this.message.guild!;
        this.memberSender = this.message.member!;
        this.memberMe = this.message.guild!.members.me!; // Guild に Bot 存在保証
    }

    public ExecListenCommand(): void {
        DistributeMessageObserver.Observe(this);
        this.resolveBotCommand();
    }

    private resolveBotCommand() {
        // コマンドフォーマットでないなら終了
        const botCommandWithArgs: string[] | null = this.makeBotCommandResolvable(this.contentSplitedArray);
        if (!botCommandWithArgs) return;

        // 存在しないコマンドなら終了
        const command: IExecBotCommand | null = this.getBotCommand(botCommandWithArgs, this);
        if (!command) return;

        // コマンド実行
        command.ExecuteWithCommonProcess();
    }

    private getBotCommand(botCommandWithArgs: string[], handler: HandlerGuildMessage): IExecBotCommand | null {
        return ClassifyBotCommand.GetEBotCommandFromValue(botCommandWithArgs, handler);
    }

    private makeBotCommandResolvable(stringArray: string[]): string[] | null {
        let botCommandWithArgs: string[] = stringArray.concat(); // コピー

        if (this.hasBotCommandPrefix(stringArray)) {
            // prefix 分を除く
            botCommandWithArgs[0] = botCommandWithArgs[0].slice(Defines.BOT_COMMAND_PREFIX.length);
            return botCommandWithArgs;
        }
        else if (this.hasMentionToMeFirst(stringArray)) {
            // 先頭のメンションを除く
            botCommandWithArgs.shift();
            return botCommandWithArgs;
        }
        else {
            // コマンドではない
            return null;
        }
    }

    private hasBotCommandPrefix(stringArray: string[]) {
        return stringArray[0][0] === Defines.BOT_COMMAND_PREFIX;
    }

    private hasMentionToMeFirst(stringArray: string[]) {
        if (stringArray[0].substring(0, 2) !== '<@') {
            return false;
        }
        if (this.message.mentions.members?.first() !== this.memberMe) {
            return false;
        }
        return true;
    }
}
