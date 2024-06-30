module.exports = {
    data: {
        name: 'listlinkchannel',
    },
    async execute(message, args, client) {
        const { adminId } = client.config;
        if (!message.member.roles.cache.some(role => role.id === adminId)) {
            return message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
        }

        if (client.config.channelId.length > 0) {
            let channelList = "📝 Daftar channel untuk deteksi link phishing:\n";
            client.config.channelId.forEach((id, index) => {
                const channel = message.guild.channels.cache.get(id);
                if (channel) {
                    channelList += `${index + 1}. ${id} - ${channel.name}\n`;
                } else {
                    channelList += `${index + 1}. ${id} - Tidak ditemukan\n`;
                }
            });
            return message.channel.send(channelList);
        } else {
            return message.channel.send("❌ Tidak ada channel yang terdaftar untuk deteksi link phishing. 😔");
        }
    },
};
