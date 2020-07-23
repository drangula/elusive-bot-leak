const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );
  let roles = await db
    .all()
    .filter(data => data.ID.startsWith(`shop_${message.guild.id}_`))
    .sort((a, b) => JSON.parse(a.data).slot - JSON.parse(b.data).slot);
  if (roles === null || roles.length < 1)
    return message.channel.send("Trenutno je shop prazan!");

  let content = "";

  for (let i = 0; i < roles.length; i++) {
    let role = message.guild.roles.cache.get(JSON.parse(roles[i].data).id);
    if (role) {
      content +=
        JSON.parse(roles[i].data).slot +
        ". " +
        role.name +
        " - " +
        "💵 " +
        JSON.parse(roles[i].data).cijena +
        "$\n";
    }
  }

  let shopEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "Zdravo, " + message.author.tag,
      message.author.displayAvatarURL()
    )
    .setDescription(content)
    .setColor(client.config.embed.color)
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();

  message.channel.send(shopEmbed);
};
exports.help = {
  name: "shop",
  description: "lista rankova u shopu",
  usage: "shop",
  category: "economy",
  listed: true
};
