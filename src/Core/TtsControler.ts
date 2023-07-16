import { AudioPlayer, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import { Channel, VoiceBasedChannel } from "discord.js";
import { Readable } from 'stream';

// TODO排他制御

interface TtsConnection {
    voiceConnection: VoiceConnection;
    textChannel: Channel;
    audioPlayer: AudioPlayer;
}

export class TtsControler {

    static ttsConnections: Set<TtsConnection> = new Set();
    static speechClient = new textToSpeech.TextToSpeechClient();

    public AddConnection(voiceChannel: VoiceBasedChannel, textChannel: Channel) {

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
    }

    public RemoveConnection(voiceChannel: VoiceBasedChannel, textChannel: Channel) {
        const ttsConnection = this.findTtsConnection(textChannel);
        if (!ttsConnection) return;

        ttsConnection.voiceConnection.destroy();
        TtsControler.ttsConnections.delete(ttsConnection);
    }

    public PlayTtsChannel(text: string, channel: Channel): void {

        const ttsConnection = this.findTtsConnection(channel);
        if (!ttsConnection) return;

        const request = this.makeSpeechRequest(text);
        TtsControler.speechClient.synthesizeSpeech(request).then(([response]) => {
            const audioContent = response.audioContent;
            if (!audioContent) return;

            const stream = Readable.from(audioContent);
            const resource = createAudioResource(stream);

            ttsConnection.voiceConnection.subscribe(ttsConnection.audioPlayer);
            ttsConnection.audioPlayer.play(resource);
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