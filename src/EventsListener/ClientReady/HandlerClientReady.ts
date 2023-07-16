import { ActivityType, Client, User } from "discord.js";
import { IEventsHandler } from "../IEventsHandler";
import { Defines } from "Core/Defines";
import { Log } from "Utility/Log";

export class HandlerClientReady implements IEventsHandler {

    client: Client;
    userMe: User;

    constructor(client: Client) {
        this.client = client;
        this.userMe = this.client.user!; // ログイン済みのため、取得保証
    }

    public ExecListenCommand() {
        const ver = Defines.APP_VERSION;

        this.client.user?.setActivity(
            `version - ${ver}　　　　　　　　　　　　　　　　`,
            { type: ActivityType.Listening }
        );

        Log.Trace("準備完了！");

    }

}