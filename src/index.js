const { Client, Collection } = require("discord.js");
const discord = require("discord.js")
const config = require("./config.json");

const client = new Client({
  disableEveryone: true,
});

client.commands = new Collection();
client.aliases = new Collection();
const { Database } = require("quickmongo");
const db = new Database(config.mongourl);
module.exports = new Database(config.mongourl);
["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
db.on("ready", () => {
  console.log("Database connected!");
});
client.on("ready", () => {
  console.log(`----------------------`);
  console.log(`Client: ${client.user.tag}`);
  console.log(`ID: ${client.user.id}`);
  console.log("Source: https://github.com/invaliduser231/CounterBot");
  console.log(`----------------------`);

  client.user.setActivity("I am Devil");
});

client.on("message", async (message) => {
  let failrole = await db.get(`failrole_${message.guild.id}`)
  client.setInterval(function () {
    var date = new Date();
    if (date.getHours() === 13 && date.getMinutes() === 25) {
      var date = new Date();
      if(failrole){
      let role = message.guild.roles.cache.find((t) => t.id == failrole);
      message.guild.members.cache.forEach((member) => {
        if (!member.roles.cache.find((t) => t.id == failrole)) return;
        member.roles.remove(role.id).then(function () {
        });
      });
    }
    }
  }, 60000);
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(config.prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);
});


client.on("message", async (message) => {
  const guild = message.guild.id;
  if (message.author.bot || !message.guild) return;
  let ccount = await db.get(`counter_${message.guild.id}`);
  if (ccount === null) return;
  if (message.channel.id === ccount) {
    let number = await db.get(`countern_${message.guild.id}`);
    let lauthor = await db.get(`counterl_${message.guild.id}`);
    let ctop = await db.get(`number_${message.guild.id}`);
    if (number === null) db.set(`countern_${message.guild.id}`, 1);
    number = await db.get(`countern_${message.guild.id}`);
    if (
      message.author.id === lauthor ||
      message.content !== number.toString()
    ) {
      let member = message.author.id;
      let roleid = await db.get(`failrole_${message.guild.id}`) 
      if(roleid != null){
      message.guild.member(member).roles.add(roleid);
      }
      var suck = number - 1;
      db.add(`fails_${guild.id}`, suck);
      const embed = new discord.MessageEmbed()
        .setDescription(
          `<@${message.author.id}> Ruinierte es bei ${suck}!! Nächste zahl: 1.`
        )
        .setColor("#9e0000");
      message.channel.send(embed);
      if (number >= ctop) {
        var tnumber = number - "1";
        db.set(`number_${message.guild.id}`, `${tnumber}`);
      }
      db.set(`counterl_${message.guild.id}`, "");
      db.set(`countern_${message.guild.id}`, 1);
      number = await db.get(`countern_${message.guild.id}`);
      lauthor = lauthor;
      message.channel.setTopic(`**Nächste Zahl:** ${number}`);
    } else {
      // Correct number!
      number = await db.get(`countern_${message.guild.id}`);
      lauthor = lauthor;
      message.channel.setTopic(`**Nächste Zahl:** ${number + 1}`);
      db.add(`countern_${message.guild.id}`, 1);
      await db.set(`counterl_${message.guild.id}`, `${message.author.id}`);
      if (number >= ctop) {
        var tnumber = number - "1";
        db.set(`number_${message.guild.id}`, `${tnumber}`);
      }
    }
  }
});

client.login(config.token);
