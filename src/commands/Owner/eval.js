const config = require("../../config.json");
const { inspect } = require("util");
const Discord = require("discord.js");
module.exports = {
  name: "eval",
  description: "Löst codes auf",
  usage: `eval <input>`,
  category: "Owner",
  run: async (client, message, args) => {
    if (message.author.id != config.ownerid) return;

    const embed = new Discord.MessageEmbed().addField(
      "Input",
      "```js\n" + args.join(" ") + "```"
    );
      const code = args.join(" ");
      if (!code) return message.channel.send("Bitte gib den code an.");
      let evaled;

      if (
        code.includes(`SECRET`) ||
        code.includes(`token`) ||
        code.includes("process.env")
      ) {
        evaled = "Was willst du mit dem token?";
      } else {
        evaled = eval(code);
      }

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, {
          depth: 0,
        });

      let output = evaled;
      if (output.length > 1024) {
        const { body } = await post("https://hastebin.com/documents").send(output);
        embed
          .addField("Output", `https://hastebin.com/${body.key}.js`)
          .setColor(0x7289da);
      } else {
            embed
              .addField("Output", "```js\n" + output + "```")
              .setColor(0x7289da);
            message.channel.send(embed);

    }
  },
};
