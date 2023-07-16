import { IHandlerMessage } from "../IHandlerMessage";
import { IExecObserveCommand } from "./IExecObserveCommand";

export abstract class ExecObserveCommandBase implements IExecObserveCommand {
    handler: IHandlerMessage;

    constructor(handler: IHandlerMessage) {
        this.handler = handler;
    }

    public ExecuteWithCommonProcess(): void {
        this.preExecute();
        this.Execute();
        this.postExecute();
    }

    public abstract Execute(): void;

    private preExecute() {
    }
    private postExecute() {
    }
}