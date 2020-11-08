const config = require("../../config.json");
const Discord = require("discord.js");
const db = require("../../index")
module.exports = {
  name: "setfail",
  description: "Setzt die fail rolle",
  usage: `setfail <@rolle>`,
  category: "Setup",
  run: async (client, message, args) => {
    const channel = message.mentions.channels.first();
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        `Du brauchst die **MANAGE GUILD** permission!`
      );
    let roleid = (await message.guild.roles.cache.get(message.mentions.roles.first().id)) || (message.guild.roles.cache.find((role) => role.name === args[1]).id) || message.guild.roles.cache.find((role) => role.id === args[1])
    if(!roleid) return message.channel.send("Das ist keine gültige rolle")
    db.set(`failrole_${message.guild.id}`, roleid)
    const embed = new Discord.MessageEmbed()
    .setTitle("Erfolgreich!")
    .setColor("#00ff00")
    .setDescription("<@&"+roleid+"> ist nun die fail rolle!")
    message.channel.send(embed)
  },
};
