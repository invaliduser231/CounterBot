const config = require("../../config.json");
const { inspect } = require("util");
const Discord = require("discord.js");
const db = require("../../index")

module.exports = {
  name: "top",
  description: "zeigt die höchste erreichte zahl an",
  category: "General",
  run: async (client, message, args) => {
    const guild = message.guild.id;
    let topzahl = await db.get(`number_${message.guild.id}`)
    let betrag2 = (await db.get(`fails_${guild.id}`)) * 30
    var betrag1 = topzahl * 30;
    var betrag = betrag1 + betrag2;
    const top = new Discord.MessageEmbed()
      .setColor("#03fcca")
      .setThumbnail(
        "https://dummyimage.com/600x400/ffffff/000000&text=" + topzahl
      )
      .setTitle("Statistiken <a:stat:709479069925769246>")
      .addField("Top Zahl", topzahl)
      .addField("Zu verlosender Betrag", "💵 " + betrag);
    message.channel.send(top);
  },
};
