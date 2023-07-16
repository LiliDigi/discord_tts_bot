import { Log } from "Utility/Log";
import { IHandlerMessage } from "../IHandlerMessage";
import { IExecBotCommand } from "./IExecBotCommand";

export abstract class ExecBotCommandBase implements IExecBotCommand {
    botCommand: string;
    botCommandWithArgs: string[];

    handler: IHandlerMessage;

    constructor(botCommandWithArgs: string[], handler: IHandlerMessage) {
        this.botCommand = botCommandWithArgs[0];
        this.botCommandWithArgs = botCommandWithArgs;

        this.handler = handler;
    }

    public ExecuteWithCommonProcess(): void {
        this.preExecute();
        this.execute();
        this.postExecute();
    }

    public abstract execute(): void;

    private preExecute() {
        Log.Info(`ExecBotCommand(${this.botCommand}) - ${this.handler.userSender.username}`);
    }
    private postExecute() {
    }
}