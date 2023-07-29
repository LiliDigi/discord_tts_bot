import { AudioPlayer, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import { Channel, GuildChannel, VoiceChannel, VoiceState } from "discord.js";
import { Readable } from 'stream';
import { Mutex } from 'await-semaphore';

interface TtsConnection {
    voiceConnection: VoiceConnection;
    textChannel: Channel;
    audioPlayer: AudioPlayer;
}

export class TtsControler {

    static ttsConnections: Set<TtsConnection> = new Set();
    static speechClient = new textToSpeech.TextToSpeechClient();
    static mutex = new Mutex();

    public AddConnection(voice: VoiceState, textChannel: Channel) {
        const voiceChannel = voice.channel;
        if (!voiceChannel) return;

        TtsControler.mutex.acquire().then((release) => {

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voice.guild.id,
                adapterCreator: voice.guild.voiceAdapterCreator,
            });

            const ttsConnection: TtsConnection = {
                voiceConnection: connection,
                textChannel: textChannel,
                audioPlayer: createAudioPlayer(),
            };

            TtsControler.ttsConnections.add(ttsConnection);
            return release;

        }).then((release: () => void) => {
            release();
        });
    }

    public RemoveConnection(voice: VoiceState, textChannel: Channel) {
        TtsControler.mutex.acquire().then((release: () => void) => {

            const ttsConnection = this.findTtsConnection(textChannel);

            // 接続情報がありの場合、それを元に退出
            // なしの場合、投稿チャンネルのguildで退出(接続と同じguildに限る)
            if (ttsConnection) {
                ttsConnection.voiceConnection.destroy();
                TtsControler.ttsConnections.delete(ttsConnection);
            }
            else {
                // 接続と投稿チャンネルのguildが同一の場合のみ退出
                if (
                    textChannel instanceof GuildChannel &&
                    voice.guild === textChannel.guild
                ) {
                    voice.disconnect();
                }
            }

            return release;

        }).then((release: () => void) => {
            release();
        });
    }

    public PlayTtsChannel(text: string, channel: Channel): void {
        TtsControler.mutex.acquire().then((release: () => void) => {

            const ttsConnection = this.findTtsConnection(channel);
            if (!ttsConnection) return release;

            const request = this.makeSpeechRequest(text);
            TtsControler.speechClient.synthesizeSpeech(request).then(([response]) => {
                const audioContent = response.audioContent;
                if (!audioContent) return release;

                const stream = Readable.from(audioContent);
                const resource = createAudioResource(stream);

                ttsConnection.voiceConnection.subscribe(ttsConnection.audioPlayer);
                ttsConnection.audioPlayer.play(resource);
            });

            return release;

        }).then((release: () => void) => {
            release();
        });
    }

    private findTtsConnection(channel: Channel): TtsConnection | null {
        for (const ttsConnection of TtsControler.ttsConnections) {
            if (ttsConnection.textChannel === channel) {
                return ttsConnection;
            }
        }
        return null;
    }

    private makeSpeechRequest(text: string): protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest {
        return {
            input: {
                text: text
            },
            voice: {
                languageCode: 'ja-JP',
                name: "ja-JP-Wavenet-A",
                // name: "ja-JP-Standard-A",
            },
            audioConfig: {
                audioEncoding: 'OGG_OPUS',
                speakingRate: 1.2
            },
        };
    }

}