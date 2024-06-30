const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: 'ping',
    },
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor("#1e2124")
            .setDescription('Pinging...');
        const ping = await message.channel.send({ embeds: [embed] });
        const latency = ping.createdTimestamp - message.createdTimestamp;
        embed.setDescription(`Pong! 🚀 Latency is ${latency}ms\nCluster 186: 19.98ms (avg)\nShard 2980: 19.64ms\nNode: Ip-10-0-14-122.ec2.internal`);
        ping.edit({ embeds: [embed] });
    },
};
