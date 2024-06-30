const { Captcha } = require("discord.js-captcha");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = (client) => {
    const captcha = new Captcha(client, {
        roleID: "1256534563149054023",
        channelID: "1256524383594352700",
        sendToTextChannel: true,
        attempts: 3,
        timeout: 30000,
        caseSensitive: false,
        addRoleOnSuccess: true,
        customPromptEmbed: new EmbedBuilder()
            .setTitle("CAPTCHA Verification 😊")
            .setDescription("Selamat datang di Genoviza Server! Silakan masukkan kode berikut untuk membuktikan kamu bukan robot/spammer. Kamu punya waktu 3 menit.")
            .setColor(0x1e2124),
        customFailureEmbed: new EmbedBuilder()
            .setTitle("Failed CAPTCHA Verification 😡")
            .setDescription("Kode yang kamu masukkan salah. Kamu bisa coba lagi atau klik tombol untuk mendapatkan tantangan baru. Kamu bisa ulangi!."),
        customSuccessEmbed: new EmbedBuilder()
            .setTitle("Success CAPTCHA Verification 😊")
            .setDescription("Kamu berhasil memverifikasi! Selamat datang di server Genoviza! Jangan lupa baca peraturan server dan kenali komunitas kita. Jika ada pertanyaan, jangan ragu untuk bertanya di channel bantuan. Nikmati petualanganmu dan semoga betah di sini!"),
    });

    captcha.on("success", (data) => {
        console.log('CAPTCHA success event triggered');

        const { channelLogVerify } = client.config;
        console.log(`Logging to channel: ${channelLogVerify}`);
        const channel = client.channels.cache.get(channelLogVerify);
        if (channel) {
            channel.send(`\`\`\`🎉 Ada Member yang Menyelesaikan CAPTCHA!\nUser: ${data.member.user.tag}\nUserID: ${data.member.user.id} 🎉\`\`\``);
        } else {
            console.log('Channel not found');
        }
    });

    return captcha;
};
