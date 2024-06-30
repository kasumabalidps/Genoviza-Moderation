const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: {
        name: 'verifysetup',
    },
    async execute(message, args, client) {
        if (message.member.roles.cache.has("1234453620293111849") && message.member.roles.cache.has("898586576169353218")) {
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
    },
};
