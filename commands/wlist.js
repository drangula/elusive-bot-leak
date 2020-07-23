const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send("Nemaš permisiju za korištenje ove komande!");

  let warns = await db
    .all()
    .filter(data => data.ID.startsWith(`warns_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  let content = "";

  for (let i = 0; i < warns.length; i++) {
    let user =
      client.users.cache.get(warns[i].ID.split("_")[2]) ||
      (await client.users.fetch(warns[i].ID.split("_")[2]));
    let warn = await db.fetch(warns[i].ID);
    content += `${i + 1}. ${user.tag} - broj warnova: ${warn}\n`;
  }
  let embed = new Discord.MessageEmbed()
    .setDescription("**Lista članova s warnovima**\n\n" + content)
    .setThumbnail(message.guild.iconURL())
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();
  message.channel.send(embed);
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "wlist",
  description: "lista članova s warnovima",
  usage: "wlist",
  category: "moderation",
  listed: true
};
