import { IHandlerMessage } from "../IHandlerMessage";
import { IExecObserveCommand } from "./IExecObserveCommand";
import { ExecObserveCommandTts } from "./Tts/ExecObserveCommandTts";

export class DistributeMessageObserver {

    public static Observe(handler: IHandlerMessage) {

        const executeTarget: IExecObserveCommand[] = [
            new ExecObserveCommandTts(handler)
        ];

        for (const target of executeTarget) {
            target.ExecuteWithCommonProcess();
        }
    }

}