import { Client, Guild, Message, MessageReaction, TextChannel, User } from "discord.js";
import fs from "fs";
import path from "path";

export class ControlRolePanel {

    private static readonly pathJson = path.resolve(__dirname, "../../resource/RolePanel.json");

    private readJson() {
        const json = JSON.parse(fs.readFileSync(ControlRolePanel.pathJson, 'utf8'));
        return json;

    }

    private writeJson(data: any) {
        fs.writeFileSync(ControlRolePanel.pathJson, JSON.stringify(data, null, ' '));
    }

    public Add(msgRolePanelPromise: Promise<Message>, emojiRolePair: { [key: string]: string; }) {
        let json = this.readJson();
        msgRolePanelPromise.then(async (msgRolePanel) => {
            json[`${msgRolePanel.guildId}_${msgRolePanel.channel.id}_${msgRolePanel.id}`] = emojiRolePair;
            this.writeJson(json);
        });
    }

    public Init(client: Client) {

        let json = this.readJson();

        for (const guild_ch_msg of Object.keys(json)) {

            const [guild_id, channel_id, message_id] = guild_ch_msg.split("_");

            const guildPromise = client.guilds.fetch(guild_id);
            const channelPromise = guildPromise.then(guild => guild.channels.fetch(channel_id));
            const messagePromise = channelPromise.then(channel => {
                if (!(channel instanceof TextChannel)) return null;
                return channel.messages.fetch(message_id);
            });

            messagePromise.then(message => {
                if (!message) return;

                const guild = message.guild;

                const emojiRolePair = json[guild_ch_msg];

                const filter = (r: MessageReaction, user: User) => !user.bot;
                const collector = message.createReactionCollector({ filter, dispose: true });

                collector.on('collect', async (reaction: MessageReaction, user) => {
                    const role = await this.getRoleFromGuildEmoji(reaction, emojiRolePair, guild);
                    if (!role) return;
                    const member = await guild.members.fetch(user.id);
                    member.roles.add(role);
                });

                collector.on('remove', async (reaction: MessageReaction, user) => {
                    const role = await this.getRoleFromGuildEmoji(reaction, emojiRolePair, guild);
                    if (!role) return;
                    const member = await guild.members.fetch(user.id);
                    member.roles.remove(role);
                });

            });

        }
        return;
    }

    private async getRoleFromGuildEmoji(reaction: MessageReaction, emojiRolePair: { [key: string]: string; }, guild: Guild) {

        const emojiName = reaction.emoji.toString();
        if (!emojiName) return null;
        if (!emojiRolePair[emojiName]) return null;

        const role = await guild.roles.fetch(emojiRolePair[emojiName]);
        if (!role) return null;

        return role;
    }
}
