const client = require("../index");
const embed = require("../utils/embed");
module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute (interaction) {
        if (!interaction.isCommand()) return;
        if (!interaction.member.roles.cache.has(process.env.ADMIN_ROLL_ID)) {
            await interaction.reply({embeds:[embed(color="Red", desc="You can't use this command")], ephemeral: true})
            return;
        }
        const command = client.commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};