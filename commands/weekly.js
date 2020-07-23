const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  if (message.channel.id !== "720037491192627221")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037491192627221>"
    );

  let user = message.author;
  let timeout = 604800000;
  let amount = 2500;

  let weekly = await db.fetch(`weekly_${message.guild.id}_${user.id}`);

  if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
    let time = ms(timeout - (Date.now() - weekly));

    let timeEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setDescription(
        `<:alert:730778124819628084> Već si sakupio/la svoju nedeljni nagradu!\n\nMožeš je opet sakupiti za ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s `
      );
    message.channel.send(timeEmbed);
  } else {
    let moneyEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setDescription(
        `<:novac:730778098680987739> Uspešno si preuzeo/la svoju nedelju nagradu! **__${amount}$__**`
      );
    message.channel.send(moneyEmbed);
    db.add(`money_${message.guild.id}_${user.id}`, amount);
    db.set(`weekly_${message.guild.id}_${user.id}`, Date.now());
  }
};
exports.help = {
  name: "weekly",
  description: "sakupljanje sedmične nagrade",
  usage: "weekly",
  category: "economy",
  listed: true
};
