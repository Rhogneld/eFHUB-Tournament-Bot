const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
    const commands = [];
    const commandsPath = path.join(__dirname, '/../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log("Loading Commands");

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        console.log(`✔ Successfully loaded ${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    // (async () => {
    //     try {
    //         console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    //         // The put method is used to fully refresh all commands in the guild with the current set
    //         const data = await rest.put(
    //             Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
    //             { body: commands },
    //         );
    
    //         console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    //     } catch (error) {
    //         // And of course, make sure you catch and log any errors!
    //         console.error(error);
    //     }
    // })();

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID),
	    { body: commands },)
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}