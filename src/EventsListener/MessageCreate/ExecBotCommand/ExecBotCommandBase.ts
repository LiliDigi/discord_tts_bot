import { Log } from "Utility/Log";
import { IHandlerMessage } from "../IHandlerMessage";
import { IExecBotCommand } from "./IExecBotCommand";

export abstract class ExecBotCommandBase implements IExecBotCommand {
    botCommand: string;
    botCommandArgs: string[];

    handler: IHandlerMessage;

    constructor(botCommandArgs: string[], handler: IHandlerMessage) {
        this.botCommand = botCommandArgs[0];
        this.botCommandArgs = botCommandArgs;

        this.handler = handler;
    }

    public ExecuteWithCommonProcess(): void {
        this.preExecute();
        this.Execute();
        this.postExecute();
    }

    public abstract Execute(): void;

    private preExecute() {
        Log.Info(`ExecBotCommand(${this.botCommand}) - ${this.handler.userSender.username}`);
    }
    private postExecute() {
    }
}