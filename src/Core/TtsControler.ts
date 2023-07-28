import { AudioPlayer, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import { Channel, VoiceBasedChannel } from "discord.js";
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

    public AddConnection(voiceChannel: VoiceBasedChannel, textChannel: Channel) {
        TtsControler.mutex.acquire().then((release) => {

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
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

    public RemoveConnection(voiceChannel: VoiceBasedChannel, textChannel: Channel) {
        TtsControler.mutex.acquire().then((release: () => void) => {

            const ttsConnection = this.findTtsConnection(textChannel);
            if (!ttsConnection) return release;

            ttsConnection.voiceConnection.destroy();
            TtsControler.ttsConnections.delete(ttsConnection);

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