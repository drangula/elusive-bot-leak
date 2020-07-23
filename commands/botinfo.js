exports.run = async (client, message, args) => {
  let owner = client.users.cache.get("649708455342505984").tag;
  if (owner === undefined) owner = client.config.owner.name;

  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let dev = client.users.cache.get(client.config.dev.id).tag;
  if (dev === undefined) dev = client.config.dev.name;

  let infoEmbed = new client.Discord.MessageEmbed()
    .setThumbnail(client.user.displayAvatarURL())
    .setAuthor(
      "Zdravo, " + message.author.username + "#" + message.author.discriminator,
      message.author.displayAvatarURL
    )
    .setDescription("__**Informacije o botu**__")
    .setColor(0x4CAAFF)
    .addField("**Ime**", client.config.ime)
    .addField("**Verzija**", client.config.verzija)
    .addField("**Owner**", owner)
    .addField("**Developer**", dev)
    .addField("**Broj servera**", client.guilds.cache.size)
    .addField("Zadnji update", client.config.update)
    .setFooter(client.config.embed.footer)
    .setTimestamp();
  message.channel.send(infoEmbed);
};
exports.help = {
  name: "botinfo",
  description: "informacije o botu",
  usage: "botinfo",
  category: "main",
  listed: true
};
