const Discord = require("discord.js");
const hastebin = require("hastebin-gen");

exports.run = async (client, message, args) => {
  message.delete();
  try {
    if (
      message.author.id !== client.config.dev.id &&
      message.author.id !== "649708455342505984"
    )
      return;
    function clean(text) {
      if (typeof text === "string") {
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      }
      return text;
    }
    function token(input) {
      if (typeof input === "string") {
        return input.replace(message.client.token, "Your TOKEN");
      } else if (typeof input === "object") {
        if (Array.isArray(input)) {
          function hasToken(value) {
            if (typeof value !== "string") {
              return true;
            }
            return value !== message.client.token;
          }
          return input.filter(hasToken);
        }
        return input;
      }
      return input;
    }
    let noembed = false;
    try {
      let code = args.join(" ");
      if (code.indexOf("--noembed") !== -1) {
        code = code.replace("--noembed", "");
        noembed = true;
      }
      let evaled = eval(code);
      let func = token(clean(evaled));
      if (typeof func !== "string") {
        func = require("util").inspect(func);
      }
      const output = "```js\n" + func + "\n```";
      const Input = "```js\n" + message.content.slice(6) + "\n```";
      let type = typeof evaled;
      if (func.length < 1000 && !noembed) {
        const embed = new Discord.MessageEmbed()
          .addField("EVAL", `**Vrsta:** ${type}`)
          .addField(":inbox_tray: Ulaz", Input)
          .addField(":outbox_tray: Izlaz", output)
          .setColor(0x80ff00)
          .setTimestamp();
        message.channel
          .send({ embed })
          .then(msg => msg.delete({ timeout: 10000 }));
      } else if (!noembed) {
        hastebin(func, { extension: ".txt" })
          .then(res => {
            const embed = new Discord.MessageEmbed()
              .addField("EVAL", `**Vrsta:** ${type}`)
              .addField(":inbox_tray: Ulaz", Input)
              .addField(
                ":outbox_tray: Izlaz",
                `Izlaz je bio predugačak pa je uploadan na ${res}`
              )
              .setColor(0x80ff00);
            message.channel
              .send({ embed })
              .then(msg => msg.delete({ timeout: 10000 }));
          })
          .catch(err => {
            console.log(err);
            const embed = new Discord.MessageEmbed()
              .addField("EVAL", `**Vrsta:** ${type}`)
              .addField(":inbox_tray: Input", Input)
              .addField(":x: ERROR", `Izlaz je bio predugačak`, true)
              .setColor(0x80ff00);
            message.channel
              .send({ embed })
              .then(msg => msg.delete({ timeout: 10000 }));
          });
      }
    } catch (err) {
      let errIns = require("util").inspect(err);
      const error = "```js\n" + errIns + "\n```";
      const Input = "```js\n" + message.content.slice(6) + "\n```";
      if (errIns.length < 1000 && !noembed) {
        const embed = new Discord.MessageEmbed()
          .addField("EVAL", `**Vrsta:** Error`)
          .addField(":inbox_tray: Ulaz", Input)
          .addField(":x: ERROR", error, true)
          .setColor(0x80ff00);
        message.channel
          .send({ embed })
          .then(msg => msg.delete({ timeout: 10000 }));
      } else if (!noembed) {
        hastebin(errIns, { extension: ".txt" })
          .then(res => {
            const embed = new Discord.MessageEmbed()
              .setTitle("Eval Error")
              .addField("EVAL", `**Vrsta:** Error`)
              .addField(":inbox_tray: Ulaz", Input)
              .addField(
                ":x: ERROR",
                "```" + err.name + ": " + err.message + "```",
                true
              )
              .setURL(res)
              .setColor(0x80ff00);
            message.channel
              .send({ embed })
              .then(msg => msg.delete({ timeout: 10000 }));
          })
          .catch(err => {
            console.log(err);
            const embed = new Discord.MessageEmbed()
              .addField("Eval", `**Vrsta:** Error`)
              .addField(":inbox_tray: Ulaz", Input)
              .addField(":x: ERROR", `Izlaz je bio predugačak`, true)
              .setColor(0x80ff00);
            message.channel
              .send({ embed })
              .then(msg => msg.delete({ timeout: 10000 }));
          });
      }
    }
  } catch (err) {
    message.channel.send(`Greška!\n\n${err}`);
    console.log(`Greška na eval komandi!\n\nGreška:\n\n ${err}`);
  }
};
exports.help = {
  name: "eval",
  description: "eval",
  usage: "eval [kod]",
  category: "dev",
  listed: false
};
