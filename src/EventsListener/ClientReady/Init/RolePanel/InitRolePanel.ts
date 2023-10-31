import { ExecInitBase } from "../ExecInitBase";
import { ControlRolePanel } from "Core/ControlRolePanel";

export class InitRolePanel extends ExecInitBase {

    public Execute(): void {
        const controlRolePanel = new ControlRolePanel();
        controlRolePanel.Init(this.handler.client);
    }
}
