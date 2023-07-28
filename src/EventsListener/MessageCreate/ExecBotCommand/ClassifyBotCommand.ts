import { IExecBotCommand } from './IExecBotCommand';
import { IHandlerMessage } from '../IHandlerMessage';

import { ExecBotCommandHelp } from "./Help/ExecBotCommandHelp";
import { ExecBotCommandTts } from './Tts/ExecBotCommandTts';
import { ExecBotCommandWikipedia } from './Wikipedia/ExecBotCommandWikipedia';
import { ExecBotCommandTranslate } from './Translate/ExecBotCommandTranslate';

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
            case 'translate':
            case 'trans':
                return new ExecBotCommandTranslate(botCommandWithArgs, handler);
            default:
                return null;
        }
    }
}