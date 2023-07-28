import { IExecBotCommand } from './IExecBotCommand';
import { IHandlerMessage } from '../IHandlerMessage';

import { ExecBotCommandHelp } from "./Help/ExecBotCommandHelp";
import { ExecBotCommandTts } from './Tts/ExecBotCommandTts';
import { ExecBotCommandWikipedia } from './Wikipedia/ExecBotCommandWikipedia';

export class ClassifyBotCommand {
    public static GetEBotCommandFromValue(botCommandWithArgs: string[], handler: IHandlerMessage): IExecBotCommand | null {
        const command: string = botCommandWithArgs[0];
        switch (command) {
            case 'help':
            case 'h':
                return new ExecBotCommandHelp(botCommandWithArgs, handler);
            case 'tts':
                return new ExecBotCommandTts(botCommandWithArgs, handler);
            case 'wikipedia':
            case 'w':
                return new ExecBotCommandWikipedia(botCommandWithArgs, handler);
            default:
                return null;
        }
    }
}