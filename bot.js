const { Client, IntentsBitField } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const yaml = require('js-yaml');

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.DirectMessages,
    ]
});

client.commands = new Map();
client.config = yaml.load(fs.readFileSync('./config/config.yml', 'utf8'));

const eventHandler = require('./handlers/eventHandler');
eventHandler(client);
const commandHandler = require('./handlers/commandHandler');
commandHandler(client);




client.login(process.env.TOKENBOT);