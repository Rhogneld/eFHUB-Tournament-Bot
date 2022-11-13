const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Interaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
    */
	async execute(client, interaction) {
		return interaction.reply('Pong!');
	},
};