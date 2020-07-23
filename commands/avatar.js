exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let user = message.mentions.users.first() || message.author;
  let avatarEmbed = new client.Discord.MessageEmbed()
    .setAuthor(user.username + "#" + user.discriminator)
    .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
    .setFooter(client.config.embed.footer)
    .setTimestamp();
  await message.channel.send(avatarEmbed);
};
exports.help = {
  name: "avatar",
  description: "prikaz avatara",
  usage: "avatar [@mention (neobavezno)]",
  category: "main",
  listed: true
};
