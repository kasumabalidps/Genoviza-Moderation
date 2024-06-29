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
    })
    
    

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
    if (message.channel.id === "1256524383594352700") {
        if (message.content.length > 10) {
            message.delete();
        }
    }
});

client.on("messageCreate", async message => {
    if (config.channelId.includes(message.channel.id)) {
        if (message.content.includes("http://") || message.content.includes("https://") || message.content.includes("discord.gg/")) {
            message.delete();
            message.channel.send("Hei bang jangan ngirim link sembarangan ya disini!! 😡").then(msg => {
                setTimeout(() => msg.delete(), 5 * 1000);
            });
        }
    }
});

captcha.on("success", async data => {
    console.log(`${data.member.user.username} sudah berhasil Solving CAPTCHA!`);
    data.member.guild.channels.cache.get("1256676647223038075").send(`\`${data.member.user.username} sudah berhasil Solving CAPTCHA!\``);
});

client.login(process.env.TOKENBOT);