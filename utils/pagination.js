const { ButtonBuilder, ActionRowBuilder, ComponentType, AttachmentBuilder } = require("discord.js");

module.exports = async function pagination(interaction, pages, time=60000) {

    if(!interaction) throw new Error("Please provide an interaction to the pagination");
    if(!pages) throw new Error("Please provide pages to the pagination");
    if(!Array.isArray(pages)) throw new Error("Pages should be an array");
    if(typeof time !== "number") throw new Error("time must be an integer");
    if(parseInt(time) < 10000) throw new Error("time must be greater than 30000ms")
    
    if(pages.length == 1) {
        const page = await interaction.editReply({
            embeds: pages,
            components: [],
            fetchReply: true
        })
        return page;
    }

    const prevButton = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("<")
    .setStyle("Secondary")

    const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel(">")
    .setStyle("Secondary")

    const buttonRow = new ActionRowBuilder().addComponents(prevButton, nextButton)
    let index = 0;
    prevButton.setDisabled(true);
    pages[index].setFooter({text:`${index+1}/${pages.length}`});
    const currentPage = await interaction.channel.send({
        embeds: [pages[index]],
        components: [buttonRow],
        fetchReply: true
    })

    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time
    })

    collector.on("collect", async (i)=> {
        if(i.user.id !== interaction.member.roles.cache.has(process.env.ADMIN_ROLL_ID))
            return i.reply({
                embeds:[embed(color="Red", desc="You cant use these buttons")],
                ephermal: true,
            })

        await i.deferUpdate();

        if(i.customId === "prev") {
            if(index > 0) index--;
        } else if (i.customId === "next") {
            if(index < pages.length -1) index++;
        }

        if(index == 0) prevButton.setDisabled(true);
        else prevButton.setDisabled(false)

        if(index == pages.length - 1) nextButton.setDisabled(true)
        else nextButton.setDisabled(false)
        pages[index].setFooter({text:`${index+1}/${pages.length}`});

        await currentPage.edit({
            embeds: [pages[index]],
            components: [buttonRow]
        })

        collector.resetTimer();
    })


    collector.on("end", async (i)=> {
        let content = ""
        pages.forEach(page => {
           content+=page.data.description
        });
        let file = new AttachmentBuilder(Buffer.from(content), {name:"Failed.txt"});
        interaction.channel.send({ files: [file] });
        pages[index].setFooter({text: "Interaction Expired Backup Text File Sent"})
        await currentPage.edit({
            embeds: [pages[index]],
            components: [],
        });
    });

    return currentPage;
}
