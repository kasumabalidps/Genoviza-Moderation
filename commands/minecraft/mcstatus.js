const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    data: {
        name: 'mcstatus',
    },
    async execute(message, args, client) {
        const serverAddress = args[0];
        if (!serverAddress) {
            return message.channel.send('Harap masukkan alamat server Minecraft.');
        }

        const embed = new EmbedBuilder()
            .setColor("#1e2124")
            .setDescription('\`\`\`Fetching... ⌛\`\`\`');
        const pingMessage = await message.channel.send({ embeds: [embed] });

        try {
            const response = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.online) {
                embed.setTitle('Minecraft Server Status `\`\`\`(🟥 Offline)\n\`\`\``')
                     .setDescription(`❌ Server ${serverAddress} sedang offline.`);
                return pingMessage.edit({ embeds: [embed] });
            }

            const motd = data.motd && data.motd.clean ? data.motd.clean.join('\n') : 'N/A';
            const playersList = data.players.list && data.players.list.length > 0 
                                ? data.players.list.map(player => player.name).join(', ') 
                                : 'No players online';

            embed.setTitle('Minecraft Server Status `\`\`\`(🟩 Online)\n\`\`\``')
                .setDescription(null) 
                .addFields(
                    { name: '🌐 IP', value: `\`\`\`text\n${data.ip}\n\`\`\``, inline: true },
                    { name: '🔌 Port', value: `\`\`\`text\n${data.port.toString()}\n\`\`\``, inline: true },
                    { name: '📦 Version', value: `\`\`\`text\n${data.version}\n\`\`\``, inline: true },
                    { name: '👥 Players', value: `\`\`\`text\n${data.players.online}/${data.players.max}\n\`\`\``, inline: true },
                    { name: '📝 MOTD', value: `\`\`\`text\n${motd}\n\`\`\``, inline: false }
                );
                
            if (data.icon) {
                embed.setThumbnail(`https://api.mcsrvstat.us/icon/${serverAddress}`);
            }

            await pingMessage.edit({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed.setTitle('Minecraft Server Status (⚠️ Error)')
                .setDescription(`⚠️ Gagal mengambil status server. Kesalahan: ${error.message}`);
            await pingMessage.edit({ embeds: [embed] });
        }
    },
};
