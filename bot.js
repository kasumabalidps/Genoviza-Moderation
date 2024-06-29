const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const dotenv = require("dotenv");
const { Captcha } = require("discord.js-captcha");

let config;
let client;

try {
    const file = fs.readFileSync('./config.yml', 'utf8');
    config = yaml.load(file);
    console.log(`✅ Config berhasil di load!`);
} catch (e) {
    console.error(`❌ Error membaca config: ${e}`);
}

dotenv.config();

client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.DirectMessages,
    ]
});

const prefix = config.prefix;

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
        .setColor("#1e2124"),
    customFailureEmbed: new EmbedBuilder()
        .setTitle("Failed CAPTCHA Verification 😡")
        .setDescription("Kode yang kamu masukkan salah. Kamu bisa coba lagi atau klik tombol untuk mendapatkan tantangan baru. Kamu bisa ulangi!."),
    customSuccessEmbed: new EmbedBuilder()
        .setTitle("Success CAPTCHA Verification 😊")
        .setDescription("Kamu berhasil memverifikasi! Selamat datang di server Genoviza! Jangan lupa baca peraturan server dan kenali komunitas kita. Jika ada pertanyaan, jangan ragu untuk bertanya di channel bantuan. Nikmati petualanganmu dan semoga betah di sini!"),
});

client.on("ready", () => {
    console.log(`🚀 Bot telah siap!`);
    let memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    let isWatchingServer = true;
    setInterval(() => {
        if (isWatchingServer) {
            client.user.setActivity({ type: ActivityType.Watching, name: `Genoviza Server 👑` });
            isWatchingServer = false;
        } else {
            client.user.setActivity({ type: ActivityType.Watching, name: `Members: ${memberCount} 🤵` });
            isWatchingServer = true;
        }
        memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    }, 7 * 1000);
});

client.on("messageCreate", async message => {
    if (message.content === `${prefix}verifysetup` && message.member.roles.cache.has("1234453620293111849") && message.member.roles.cache.has("898586576169353218")) {
        const embed = new EmbedBuilder()
            .setColor("#1e2124")
            .setDescription("Klik tombol di bawah untuk memverifikasi bahwa kamu manusia dan mendapatkan akses ke server.");
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Verify Kuy 👌")
                    .setCustomId("verify")
            );

        await message.channel.send({ embeds: [embed], components: [row], ephemeral: true });
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "verify") {
        captcha.present(interaction.member);
    }
});

client.on("messageCreate", async message => {
    if (message.channel.id === "1256524383594352700" && message.content.length > 10) {
        try {
            await message.delete();
        } catch (error) {
            console.error(`Error deleting message: ${error}`);
        }
    }
});

client.on("messageCreate", async message => {
    if (config.channelId.includes(message.channel.id) || message.channel.type === "GUILD_PUBLIC_THREAD") {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|discord\.gg\//gi;
        const found = message.content.match(regex);
        if (found && found.length > 0) {
            const allowedDomains = config.allowedDomains;
            let isAllowed = false;
            found.forEach(link => {
                allowedDomains.forEach(domain => {
                    if (link.includes(domain)) {
                        isAllowed = true;
                    }
                });
            });
            if (!isAllowed) {
                try {
                    await message.delete();
                } catch (error) {
                    console.error(`Error deleting message: ${error}`);
                }
                message.channel.send("Tidak diperbolehkan mengirimkan link ke chat ini. Pastikan Anda tidak mengirimkan link phishing atau berbahaya. 😊").then(msg => {
                    setTimeout(() => msg.delete(), 5 * 1000);
                });
            }
        }
    }
});

client.on("messageCreate", async message => {
    if (message.content.startsWith("!addlinkchannel")) {
        if (!message.member.roles.cache.some(role => role.id === "1234453620293111849")) {
            message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
            return;
        }
        const channelId = message.content.split(" ")[1];
        if (channelId) {
            if (config.channelId.includes(channelId)) {
                message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) sudah ada di dalam daftar deteksi link phishing. Silahkan cek pada !listlinkchannel 📝`);
            } else {
                config.channelId.push(channelId);
                fs.writeFileSync('./config.yml', yaml.dump(config));
                message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) telah ditambahkan ke dalam daftar deteksi link phishing. 👍`);
            }
        } else {
            message.channel.send("Format command salah. Gunakan `!addlinkchannel [id]`. 🤔");
        }
    } else if (message.content.startsWith("!removelinkchannel")) {
        if (!message.member.roles.cache.some(role => role.id === "1234453620293111849")) {
            message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
            return;
        }
        const channelId = message.content.split(" ")[1];
        if (channelId) {
            if (config.channelId.includes(channelId)) {
                const index = config.channelId.indexOf(channelId);
                config.channelId.splice(index, 1);
                fs.writeFileSync('./config.yml', yaml.dump(config));
                message.channel.send(`Channel dengan ID ${channelId} (${message.guild.channels.cache.get(channelId).name}) telah dihapus dari daftar deteksi link phishing. 👋`);
            } else {
                message.channel.send(`Channel dengan ID ${channelId} tidak ditemukan dalam daftar deteksi link phishing. 🤔`);
            }
        } else {
            message.channel.send("Format command salah. Gunakan `!removelinkchannel [id]`. 🤔");
        }
    } else if (message.content === "!listlinkchannel") {
        if (!message.member.roles.cache.some(role => role.id === "1234453620293111849")) {
            message.channel.send("Maaf, Anda tidak memiliki izin untuk menggunakan command ini. 😊");
            return;
        }
        if (config.channelId.length > 0) {
            let channelList = "📝 Daftar channel untuk deteksi link phishing:\n";
            config.channelId.forEach((id, index) => {
                channelList += `${index + 1}. ${id} - ${message.guild.channels.cache.get(id).name}\n`;
            });
            message.channel.send(channelList);
        } else {
            message.channel.send("Tidak ada channel yang terdaftar untuk deteksi link phishing. 😔");
        }
    }
});

captcha.on("success", async data => {
    console.log(`${data.member.user.username} sudah berhasil Solving CAPTCHA!`);
    data.member.guild.channels.cache.get("1256676647223038075").send(`\`${data.member.user.username} sudah berhasil Solving CAPTCHA!\``);
});

// crash handler
process.on('uncaughtException', (error) => {
    console.error('💻 Bot mengalami kesalahan dan akan di-restart:', error);
    process.exit(1);
});

process.on('exit', (code) => {
    console.log(`💻 Bot sedang di-restart dengan kode ${code}`);
    setTimeout(() => {
        process.exec(process.argv[0], process.argv.slice(1));
    }, 1000);
});




client.login(process.env.TOKENBOT);