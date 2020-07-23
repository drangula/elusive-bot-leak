const db = require("quick.db");

module.exports = async (client, oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (client.user === oldMessage.author) return;
  let logs = await db.fetch(`logs_${oldMessage.guild.id}_msglogs`);
  if (logs === null) return;
  logs = oldMessage.guild.channels.cache.get(logs);
  if (logs === undefined || logs === null) return;
  if (oldMessage != newMessage) {
    let embed = new client.Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setAuthor("Poruka je uređena!")
      .setDescription("**Kanal:** " + oldMessage.channel.name)
      .addField("**Stara poruka**", oldMessage.cleanContent)
      .addField("**Nova poruka**", newMessage.cleanContent)
      .setFooter(
        "Autor poruke: " +
          oldMessage.author.username +
          " | " +
          client.config.ime
      )
      .setTimestamp();
    logs.send(embed);
  }
};
