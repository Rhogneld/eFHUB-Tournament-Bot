const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Interaction } = require("discord.js");
const { parse } = require("csv-parse");
var request = require("request");
const pagination = require("../utils/pagination");
const arrayToPages = require("../utils/arrayToPages");
const embed = require("../utils/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tournbulk")
        .setDescription("Initiate tournament role allocation")
        .addNumberOption((option) =>
            option
                .setName("size")
                .setRequired(true)
                .setDescription("Maximum size of participants")
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setRequired(true)
                .setDescription("Tournament Role")
        ),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        await interaction.guild.members.fetch()
        const size = interaction.options.getNumber("size");
        const role = interaction.options.getRole("role");
        let found=[];
        let notFound=[];

        const filter = (response) => {
            if(response.author.id !== interaction.user.id) return false;
            // if (response.author != interaction.author) return false;
            // return true;
            const attachments = response.attachments.map(
                (value) => {
                    if(value.attachment.indexOf("csv", value.attachment.length - 3) !== -1) {
                        return value.attachment;
                    }
                }
            );
            console.log(attachments);
            if (attachments.length == 1 && attachments[0] != undefined) return true;
            else return false;
        };
        interaction
            .reply({
                embeds:[embed("Blurple", desc="Attach participant CSV file")],
                fetchReply: true,
            })
            .then(() => {
                interaction.channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 120000,
                        errors: ["time"],
                    })
                    .then((collected) => {
                        // console.log(collected.first().attachments.first().attachment)
                        interaction.followUp({embeds:[embed("Blurple", desc="Parsing CSV!")]});
                        request.get(collected.first().attachments.first().attachment, function (error, response, body) {
                        // request.get("https://cdn.discordapp.com/attachments/1041038912937807906/1041102645315768470/efhub.csv", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var csv = body;
                            // Continue with your processing here.
                            parse(csv, {
                                delimiter: ",",
                                from_line: 2,
                                to_line: size + 1,
                            })
                            .on("data", function (row) {
                                let user = client.users.cache.find(user=> (user.tag == row[3] || user.username == row[3]));
                                if(user) {
                                    found.push(user);
                                    interaction.channel.send(`${user} has been assigned ${role}`);
                                    let member = interaction.guild.members.cache.get(user.id);
                                    member.roles.add(role);
                                }
                                else {
                                    // interaction.channel.send(`Cannot find user ${row[3]}`);
                                    notFound.push(row.join(", "));
                                }
                            })
                            .on("end", function () {
                                interaction.followUp({embeds:[embed("Green", desc="CSV Parsed")]})
                                // pagination(interaction, arrayToPages(found, "Green", "Found the following users"));
                                pagination(interaction, arrayToPages(notFound, "Red", "Following users were not found"));
                                console.log("finished");
                            })
                            .on("error", function (error) {
                                console.log(error.message);
                            });
                        }
                         });
                    })
                    .catch((collected) => {
                        interaction.followUp({embeds:[embed("Red", desc="Looks like you didn't provide a csv file in time")]}
                        );
                    });
        }
        );
    },
};
