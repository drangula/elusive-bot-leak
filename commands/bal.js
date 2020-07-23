const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let user = message.mentions.members.first() || message.author;
  let userr = message.mentions.users.first() || message.author;
  if (userr.bot) return message.channel.send("Bot je sirotinja!");

  let bal = await db.fetch(`money_${message.guild.id}_${user.id}`);

  if (bal === null) bal = 0;

  let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`);
  if (bank === null) bank = 0;

  let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(
      `**Stanje na računu člana ${user}**\n\nDžep: ${bal}$\nBanka: ${bank}$`
    );
  message.channel.send(moneyEmbed);
};
exports.help = {
  name: "bal",
  description: "stanje na računu",
  usage: "bal [@mention (neobavezno)]",
  category: "economy",
  listed: true
};
