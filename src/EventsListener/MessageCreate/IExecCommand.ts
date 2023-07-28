import { IEventsHandler } from "EventsListener/IEventsHandler";
export interface IExecCommand {
    handler: IEventsHandler;

    ExecuteWithCommonProcess(): void;
    Execute(): void;
}