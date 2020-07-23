const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let user = message.author;

  let member = await db.fetch(`money_${message.guild.id}_${user.id}`);
  let member2 = await db.fetch(`bank_${message.guild.id}_${user.id}`);

  let embed5 = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(
      "<:Ne:720248651485544508> Ne možeš prebaciti 0$ na banku!"
    );

  if (args[0] == 0) return message.channel.send(embed5);
  else if (args[0] == "all") {
    let money = await db.fetch(`money_${message.guild.id}_${user.id}`);
    let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`);

    let embedbank = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(
        "<:Ne:720248651485544508> Nemaš nikakav novac za depozit!"
      );

    if (money === 0) return message.channel.send(embedbank);

    db.add(`bank_${message.guild.id}_${user.id}`, Number(money));
    db.subtract(`money_${message.guild.id}_${user.id}`, Number(money));
    let embedall = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(`<:novac:730778098680987739> Prebacio/la si sav novac na banku!`);
    message.channel.send(embedall);
  } else {
    let embed2 = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(
        `<:novac:730778098680987739> Napiši iznos koji želiš prebaciti na banku!`
      );

    if (!args[0]) {
      return message.channel.send(embed2).catch(err => console.log(err));
    }
    let embed3 = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(
        `<:Ne:720248651485544508> Ne možeš prebaciti negativan novac!`
      );

    if (message.content.includes("-")) {
      return message.channel.send(embed3);
    }
    let embed4 = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(`<:Ne:720248651485544508> Nemaš dovoljno novca za obavljanje ove radnje!`);

    if (member < args[0]) {
      return message.channel.send(embed4);
    }
    let embed6 = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(
        "<:Ne:720248651485544508> Ne možeš koristiti znakove!"
      );

    if (args[0] != Number(args[0])) {
      return message.channel.send(embed6);
    }

    let embed7 = new Discord.MessageEmbed()
      .setColor("#4CAAFF")
      .setDescription(
        `<:Da:720248621701791805> Prebacio/la si ${args[0]}$ na banku!`
      );

    message.channel.send(embed7);
    db.add(`bank_${message.guild.id}_${user.id}`, Number(args[0]));
    db.subtract(`money_${message.guild.id}_${user.id}`, Number(args[0]));
  }
};
exports.help = {
  name: "deposit",
  description: "stavljanje novca na banku",
  usage: "deposit [iznos]",
  category: "economy",
  listed: true
};
