const fs = require('fs');
const yaml = require('js-yaml');

module.exports = {
    data: {
        name: 'addlinkchannel',
    },
    async execute(message, args, client) {
        if (!message.member.roles.cache.some(role => role.id === "1234453620293111849")) {
            return message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
        }

        const channelId = args[0];
        if (channelId) {
            if (client.config.channelId.includes(channelId)) {
                return message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) sudah ada di dalam daftar deteksi link phishing. Silahkan cek pada !listlinkchannel 📝`);
            } else {
                client.config.channelId.push(channelId);
                fs.writeFileSync('./config/config.yml', yaml.dump(client.config));
                return message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) telah ditambahkan ke dalam daftar deteksi link phishing. 👍`);
            }
        } else {
            return message.channel.send("Format command salah. Gunakan `!addlinkchannel [id]`. 🤔");
        }
    },
};
