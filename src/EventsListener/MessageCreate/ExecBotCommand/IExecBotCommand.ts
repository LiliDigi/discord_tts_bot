import { IExecCommand } from "../../IExecCommand";

export interface IExecBotCommand extends IExecCommand {
    botCommand: string;
    botCommandArgs: string[];
}