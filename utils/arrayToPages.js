const { EmbedBuilder } = require("discord.js");

module.exports = function arrayToPages(data, color="Red", title="Untitled") {
    let pages = new Array();
    let chunkedData = data.reduce((all,one,i) => {
        const ch = Math.floor(i/10); 
        all[ch] = [].concat((all[ch]||[]),one); 
        return all
     }, [])
    for (const chunk of chunkedData) {
        const page = new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(chunk.join('\n'));
        pages.push(page);
    }

    return pages;
}
