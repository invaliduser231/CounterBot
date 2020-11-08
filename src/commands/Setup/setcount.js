const config = require("../../config.json");
const Discord = require("discord.js");
const db = require("../../index")
module.exports = {
  name: "setcount",
  description: "Setzt den count channel",
  usage: `setcount <#channel>`,
  category: "Setup",
  run: async (client, message, args) => {
    const channel = message.mentions.channels.first();
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        `Du brauchst die **MANAGE GUILD** permission!`
      );
    if (!channel && args[0].toLowerCase() != "delete")
      return message.channel.send(
        "Ungültiger channel, bitte ping einen channel!!"
      );
    let ccount = await db.get(`counter_${message.guild.id}`);
    if (args[0].toLowerCase() === "delete") {
      db.delete(`counter_${message.guild.id}`);
      message.channel.send(`Counter gelöscht!`);
    } else {
        db.set(`counter_${message.guild.id}`, `${channel.id}`);
        message.channel.send(`Count chat wurde auf ${channel} gesetzt!`);
    }
  },
};
