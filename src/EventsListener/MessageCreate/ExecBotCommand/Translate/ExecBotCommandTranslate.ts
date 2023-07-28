import { IHandlerMessage } from 'EventsListener/MessageCreate/IHandlerMessage';
import { ExecBotCommandBase } from '../ExecBotCommandBase';
import Axios, { AxiosInstance } from 'axios';
import { franc } from 'franc-min';
import langs from 'langs'
import { Defines } from 'Core/Defines';

enum EReplyReason {
    success = 1,
    noContent,
    unsupportedLang,
}

export class ExecBotCommandTranslate extends ExecBotCommandBase {

    private langSource: string;
    private langTarget: string;
    private textSource: string;
    private replySourceId: string | null;

    constructor(botCommandWithArgs: string[], handler: IHandlerMessage) {
        super(botCommandWithArgs, handler);

        const langArray = ExecBotCommandTranslate.getLangFromContentArgs(botCommandWithArgs);
        this.langSource = langArray[0];
        this.langTarget = langArray[1];

        this.replySourceId = handler.message.reference?.messageId ?? null;
        this.textSource = this.botCommandWithArgs.slice(1).join(" ");
    }

    // [0]langSource, [1]langTarget
    static getLangFromContentArgs(contentArgs: string[]): string[] {
        const ret: string[] = [];
        const tmpArgs = contentArgs.slice();
        if (langs.has("1", tmpArgs[1])) ret.push(tmpArgs.splice(1, 1)[0]);
        if (langs.has("1", tmpArgs[1])) ret.push(tmpArgs.splice(1, 1)[0]);
        return ret;
    }

    public Execute(): void {

        // テキストがない場合、終了
        if (!this.textSource) {
            this.replyDispatcher(EReplyReason.noContent);
            return;
        }

        // 翻訳元の言語指定ない場合、自動判別
        // 対応言語ない場合、終了
        if (!this.textSource) {
            const iso639_3 = franc(this.textSource, { minLength: 1 });
            const langSource = langs.where("3", iso639_3)?.[1];

            // ISO639-3判別失敗 or ISO639-1変換失敗で終了
            if (
                !langs.has("3", iso639_3) ||
                !langSource
            ) {
                this.replyDispatcher(EReplyReason.unsupportedLang);
                return;
            }

            this.langSource = langSource;
        }

        // 翻訳先の言語指定ない場合のデフォルト設定
        // 翻訳元が日本語なら英語、それ以外なら日本語
        if (!this.langTarget) {
            this.langTarget = (this.langSource === "ja") ? "en" : "ja";
        }

        const axios = this.createAxios();

        axios.get('/').then((response) => {
            const text = response.data.text;
            this.replyDispatcher(EReplyReason.success, text);
        });
    }

    private createAxios(): AxiosInstance {
        let request = {
            baseURL: Defines.URL_GOOGLE_API_TRANSLATE,
            params: {
                text: this.textSource,
                source: this.langSource,
                target: this.langTarget
            }
        }

        const axios = Axios.create(request);
        return axios;
    }

    private replyDispatcher(reason: EReplyReason, content: string = ""): void {

        switch (reason) {
            case EReplyReason.success:
                break;
            case EReplyReason.noContent:
                content = "翻訳する文がありません";
                break;
            case EReplyReason.unsupportedLang:
                content = "その言語は対応していません";
                break;
        }

        this.handler.message.reply({ content });
    }
}