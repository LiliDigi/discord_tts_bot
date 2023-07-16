import { IExecBotCommand } from './IExecBotCommand';
import { IHandlerMessage } from '../IHandlerMessage';

import { ExecBotCommandHelp } from "./Help/ExecBotCommandHelp";
import { ExecBotCommandTts } from './Tts/ExecBotCommandTts';

export class ClassifyBotCommand {
    public static GetEBotCommandFromValue(botCommandWithArgs: string[], handler: IHandlerMessage): IExecBotCommand | null {
        const command: string = botCommandWithArgs[0];
        switch (command) {
            case 'help':
            case 'h':
                return new ExecBotCommandHelp(botCommandWithArgs, handler);
            case 'tts':
                return new ExecBotCommandTts(botCommandWithArgs, handler);
            default:
                return null;
        }
    }
}