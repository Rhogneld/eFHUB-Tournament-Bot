const { EmbedBuilder } = require("discord.js");

module.exports = function embed(
    color = "Blurple", title, desc, footer
) {
    const embed = new EmbedBuilder()

    if(color.length > 1) {
        embed.setColor(color)
    }
    if(title && title?.length > 1) {
        embed.setTitle(title)
    }
    if(desc && desc?.length > 1) {
        embed.setDescription(desc)
    } 
    if(footer && footer?.length > 1) {
        embed.setFooter({text: footer})
    }
    return embed;
};
