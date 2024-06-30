module.exports = {
    data: {
        name: 'ping',
    },
    async execute(message, args, client) {
        const ping = await message.channel.send('Pinging...');
        ping.edit(`Pong! 🚀 Latency is ${ping.createdTimestamp - message.createdTimestamp}ms`);
    },
};
