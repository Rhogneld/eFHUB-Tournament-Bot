require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,
} = require("discord.js");

module.exports = client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});

client.commands = new Collection();

require("./handlers/command")(client);
require("./handlers/event")(client);

client.login(process.env.BOT_TOKEN);
