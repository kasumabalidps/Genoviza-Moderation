const fs = require('fs');
const yaml = require('js-yaml');

module.exports = {
    data: {
        name: 'removelinkchannel',
    },
    async execute(message, args, client) {
        if (!message.member.roles.cache.some(role => role.id === "1234453620293111849")) {
            return message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
        }

        const channelId = args[0];
        if (channelId) {
            if (client.config.channelId.includes(channelId)) {
                const index = client.config.channelId.indexOf(channelId);
                client.config.channelId.splice(index, 1);
                fs.writeFileSync('./config/config.yml', yaml.dump(client.config));
                return message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) telah dihapus dari daftar deteksi link phishing. 👋`);
            } else {
                return message.channel.send(`Channel dengan ID ${channelId} tidak ditemukan dalam daftar deteksi link phishing. 🤔`);
            }
        } else {
            return message.channel.send("Format command salah. Gunakan `!removelinkchannel [id]`. 🤔");
        }
    },
};
