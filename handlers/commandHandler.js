const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            if (command.data && command.data.name) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Command loaded: ${command.data.name}`);
            } else {
                console.error(`❌ Error loading command: ${file} does not have a valid data.name property`);
            }
        }
    }
};
