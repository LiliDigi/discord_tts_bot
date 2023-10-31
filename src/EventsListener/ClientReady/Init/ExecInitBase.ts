import { Log } from "Utility/Log";
import { IExecInit } from "./IExecInit";
import { IEventsHandler } from "EventsListener/IEventsHandler";

export abstract class ExecInitBase implements IExecInit {

    initTarget: string;
    handler: IEventsHandler;

    constructor(initTarget: string, handler: IEventsHandler) {
        this.initTarget = initTarget;
        this.handler = handler;
    }

    public ExecuteWithCommonProcess(): void {
        this.preExecute();
        this.Execute();
        this.postExecute();
    }

    public abstract Execute(): void;

    private preExecute() {
        Log.Info(`ExecInit(${this.initTarget})`);
    }
    private postExecute() {
    }
}