import { IExecCommand } from "../IExecCommand";

export interface IExecBotCommand extends IExecCommand {
    botCommand: string;
    botCommandWithArgs: string[];
}