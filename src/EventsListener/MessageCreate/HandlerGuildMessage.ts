import { Guild, GuildMember, Message } from 'discord.js';
import { Defines } from 'Core/Defines';

import { HandlerMessageBase } from './HandlerMessageBase';
import { ClassifyBotCommand } from './ExecBotCommand/ClassifyBotCommand';
import { IExecBotCommand } from './ExecBotCommand/IExecBotCommand';
import { ExecBotCommandNone } from './ExecBotCommand/None/ExecBotCommandNone';
import { DistributeMessageObserver } from './ExecObserveCommand/DistributeMessageObserver';

export class HandlerGuildMessage extends HandlerMessageBase {

    guild: Guild;
    memberSender: GuildMember;
    memberMe: GuildMember;

    contentSplitedArray: string[];

    constructor(message: Message) {
        super(message);
        this.contentSplitedArray = this.content.split(" ").filter(Boolean);

        // 以下、上位で GuildMessage 保証
        this.guild = this.message.guild!;
        this.memberSender = this.message.member!;
        this.memberMe = this.message.guild!.members.me!; // Guild に Bot 存在保証
    }

    public ExecListenCommand(): void {
        this.resolveBotCommand();
        DistributeMessageObserver.Observe(this);
    }

    private resolveBotCommand() {
        const botCommandWithArgs: string[] = this.makeBotCommandResolvable(this.contentSplitedArray);
        const command: IExecBotCommand = this.getBotCommand(botCommandWithArgs, this);
        if (command instanceof ExecBotCommandNone) return;

        command.ExecuteWithCommonProcess();
    }

    private getBotCommand(botCommandWithArgs: string[], handler: HandlerGuildMessage): IExecBotCommand {
        return ClassifyBotCommand.GetEBotCommandFromValue(botCommandWithArgs, handler);
    }

    private makeBotCommandResolvable(stringArray: string[]): string[] {
        let botCommandWithArgs: string[] = stringArray.concat();

        if (this.hasBotCommandPrefix(stringArray)) {
            // prefix 分を除く
            botCommandWithArgs[0] = botCommandWithArgs[0].slice(Defines.BOT_COMMAND_PREFIX.length);
        }
        else if (this.hasMentionToMeFirst(stringArray)) {
            // 先頭のメンションを除く
            botCommandWithArgs.shift();
        }
        else {
            // コマンドではない、何もしない
        }

        return botCommandWithArgs;
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
