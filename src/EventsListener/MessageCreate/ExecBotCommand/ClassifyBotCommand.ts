import { IExecBotCommand } from './IExecBotCommand';
import { IHandlerMessage } from '../IHandlerMessage';

import { ExecBotCommandHelp } from "./Help/ExecBotCommandHelp";
import { ExecBotCommandTts } from './Tts/ExecBotCommandTts';
import { ExecBotCommandWikipedia } from './Wikipedia/ExecBotCommandWikipedia';

export class ClassifyBotCommand {
    public static GetEBotCommandFromValue(botCommandArgs: string[], handler: IHandlerMessage): IExecBotCommand | null {
        const command: string = botCommandArgs[0];
        switch (command) {
            case 'help':
            case 'h':
                return new ExecBotCommandHelp(botCommandArgs, handler);
            case 'tts':
                return new ExecBotCommandTts(botCommandArgs, handler);
            case 'wikipedia':
            case 'w':
                return new ExecBotCommandWikipedia(botCommandArgs, handler);
            default:
                return null;
        }
    }
}