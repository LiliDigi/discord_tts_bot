import { ApplicationException } from '../../../../Utility/ApplicationException';
import { ExecBotCommandBase } from '../ExecBotCommandBase';

export class ExecBotCommandNone extends ExecBotCommandBase {
    execute(): void {
        throw new ApplicationException(
            `Executed a non-existent command.: ${this.botCommandWithArgs}`
        );
    }
}