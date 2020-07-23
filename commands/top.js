const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {


  let money = await db
    .all()
    .filter(data => data.ID.startsWith(`money_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  let content = "";

  for (let i = 0; i < money.length; i++) {
    if (i === 10) break;

    let user = client.users.cache.get(money[i].ID.split("_")[2]).username;

    content += `${i + 1}. ${user} ~ ${money[i].data}$\n`;
  }

  const embed = new Discord.MessageEmbed()
    .setDescription(`<:novac:730778098680987739> **__Tabela najbogatijih članova__**\n\n${content}`)
    .setColor("#4CAAFF");

  message.channel.send(embed);
};
exports.help = {
  name: "top",
  description: "lista najbogatijih članova",
  usage: "top",
  category: "economy",
  listed: true
};
