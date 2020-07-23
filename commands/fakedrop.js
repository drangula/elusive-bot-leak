const Discord = require("discord.js");
const db = require("quick.db");
const role = require("../rolechecker.js");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nemaš permisiju za korištenje ove komande!", color: 0x36393f}});

  let vrsta = args[0];
  if (!vrsta)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisi napisao/la vrstu (uloga/novac).", color: 0x36393f}});
  if (vrsta === "uloga") {
    let uloga = message.mentions.roles.first();
    if (!uloga) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisi označio/la ulogu!", color: 0x36393f}});
    if (role.isModerator(uloga))
      return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Ta uloga ima moderatorske permisije!", color: 0x36393f}});
    message.delete();
    let embed = new Discord.MessageEmbed()
      .setTitle("📦 Pojavio se neočekivani drop!")
      .setColor(uloga.color)
      .setDescription(
        "U dropu se nalazi uloga **" +
          uloga.name +
          "**\nDa je uzmeš reaguj na ovu poruku sa 📦\nNakon 30 sekundi ovaj drop će nestati!"
      )
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();
    let msg = await message.channel.send(embed);
    await msg.react("📦");
    const filter = (reaction, user) =>
      reaction.emoji.name === "📦" && user.id !== client.user.id;
    const collector = msg.createReactionCollector(filter, { time: 30000 });
    let timelimit = true;
    let collected = false;
    collector.on("collect", (reaction, reactionCollector) => {
      reaction.users.cache.forEach(user => {
        if (user.id !== client.user.id) {
          let member = message.guild.members.cache.get(user.id);
          if (member.roles.cache.has(uloga.id)) return;
          if (!collected) {
            collected = true;
            msg.reactions.removeAll();
            let takenEmbed = new Discord.MessageEmbed().setTitle(
              user.username + " je uzeo/la ulogu iz dropa!"
            );
            msg.edit(takenEmbed);
            timelimit = false;
          }
        }
      });
    });
    collector.on("end", collected => {
      if (timelimit) {
        let expiredEmbed = new Discord.MessageEmbed().setTitle(
          "Isteklo je vrijeme za reakciju!"
        );
        msg.edit(expiredEmbed);
      }
    });
  } else if (vrsta === "novac") {
    let novac = args[1];
    if (!novac) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Napisao/la si nepravilnu vrstu!", color: 0x36393f}});
    if (isNaN(novac) || novac < 1 || novac > 500000)
      return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Novac ne može sadržavati znakove, biti manji od 1$ ili veći od 500000$", color: 0x36393f}});
    message.delete();
    let embed = new Discord.MessageEmbed()
      .setTitle("📦 Pojavio se neočekivani drop!")
      .setColor("RANDOM")
      .setDescription(
        "U dropu se nalazi **" +
          novac +
          "$**\nDa uzmeš novac reaguj na ovu poruku sa 📦\nNakon 30 sekundi ovaj drop će nestati!"
      )
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();
    let msg = await message.channel.send(embed);
    await msg.react("📦");
    const filter = (reaction, user) =>
      reaction.emoji.name === "📦" && user.id !== client.user.id;
    const collector = msg.createReactionCollector(filter, { time: 30000 });
    let timelimit = true;
    let collected = false;
    collector.on("collect", (reaction, reactionCollector) => {
      reaction.users.cache.forEach(user => {
        if (user.id !== client.user.id) {
          if (!collected) {
            collected = true;
            msg.reactions.removeAll();
            let takenEmbed = new Discord.MessageEmbed().setTitle(
              user.username + " je uzeo/la " + novac + "$ iz dropa!"
            );
            msg.edit(takenEmbed);
            timelimit = false;
          }
        }
      });
    });
    collector.on("end", collected => {
      if (timelimit) {
        let expiredEmbed = new Discord.MessageEmbed().setTitle(
          "Isteklo je vrijeme za reakciju!"
        );
        msg.edit(expiredEmbed);
      }
    });
  } else return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Napisao/la si nepravilnu vrstu!", color: 0x36393f}});
};
exports.help = {
  name: "fakedrop",
  description: "dropanje uloga ili novca",
  usage: "fakedrop [vrsta (uloga/novac)]",
  category: "admin",
  listed: false
};
