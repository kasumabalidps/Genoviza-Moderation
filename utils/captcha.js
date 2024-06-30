const { Captcha, EmbedBuilder } = require("discord.js-captcha");

module.exports = (client) => {
    return new Captcha(client, {
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
            .setColor("#1e2124"),
        customFailureEmbed: new EmbedBuilder()
            .setTitle("Failed CAPTCHA Verification 😡")
            .setDescription("Kode yang kamu masukkan salah. Kamu bisa coba lagi atau klik tombol untuk mendapatkan tantangan baru. Kamu bisa ulangi!."),
        customSuccessEmbed: new EmbedBuilder()
            .setTitle("Success CAPTCHA Verification 😊")
            .setDescription("Kamu berhasil memverifikasi! Selamat datang di server Genoviza! Jangan lupa baca peraturan server dan kenali komunitas kita. Jika ada pertanyaan, jangan ragu untuk bertanya di channel bantuan. Nikmati petualanganmu dan semoga betah di sini!"),
    });
};
