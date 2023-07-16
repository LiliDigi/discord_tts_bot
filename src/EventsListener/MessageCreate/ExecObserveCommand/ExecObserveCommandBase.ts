import { IHandlerMessage } from "../IHandlerMessage";
import { IExecObserveCommand } from "./IExecObserveCommand";

export abstract class ExecObserveCommandBase implements IExecObserveCommand {
    handler: IHandlerMessage;

    constructor(handler: IHandlerMessage) {
        this.handler = handler;
    }

    public ExecuteWithCommonProcess(): void {
        if (this.DisallowProcess()) return;
        this.preExecute();
        this.Execute();
        this.postExecute();
    }

    public abstract Execute(): void;
    public DisallowProcess(): boolean { return false; }

    private preExecute() {
    }
    private postExecute() {
    }
}