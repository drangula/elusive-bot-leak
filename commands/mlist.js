const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send("Nemaš permisiju za korištenje ove komande!");

  let members = await message.guild.roles.cache
    .find(r => r.name === "Muted")
    .members.map(m => m.user);
  let content = "";

  for (let i = 0; i < members.length; i++) {
    let mutetime = await db.fetch(
      `mutetime_${message.guild.id}_${members[i].id}`
    );
    if (mutetime === null) content += `${i + 1}. ${members[i].tag}\n`;
    if (mutetime !== null) {
      let time = ms(mutetime.time - (Date.now() - mutetime.date));
      content += `${i + 1}. ${members[i].tag} - vrijeme: ${time.days}d ${
        time.hours
      }h ${time.minutes}min ${time.seconds}s\n`;
    }
  }
  let embed = new Discord.MessageEmbed()
    .setDescription("**Lista mutiranih članova**\n\n" + content)
    .setThumbnail(message.guild.iconURL())
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();
  message.channel.send(embed);
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "mlist",
  description: "lista mutiranih članova",
  usage: "mlist",
  category: "moderation",
  listed: true
};
