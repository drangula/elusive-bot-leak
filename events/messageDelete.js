const db = require("quick.db");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (client.user === message.author) return;
  let logs = await db.fetch(`logs_${message.guild.id}_msglogs`);
  if (logs === null) return;
  logs = message.guild.channels.cache.get(logs);
  if (logs === undefined || logs === null) return;
  let embed = new client.Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setAuthor("Poruka je izbrisana iz kanala " + message.channel.name)
    .setDescription(message.cleanContent)
    .setFooter(
      "Autor poruke: " + message.author.username + " | " + client.config.ime
    )
    .setTimestamp();
  logs.send(embed);
};
