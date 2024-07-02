module.exports = async (client, message) => {
    const { prefix } = client.config;
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(`❌ Error executing command: ${error.message}`);
    }
};

