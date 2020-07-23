let db = require("quick.db");
exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );
  let tacno = client.emojis.cache.get("720248621701791805");
  let netacno = client.emojis.cache.get("720248651485544508");
  let user = message.mentions.users.first() || message.author;
  let vip = " ‍" + netacno.toString();
  message.member.roles.cache.forEach(role => {
    if (role.name.includes("VIP")) vip = " ‍" + tacno.toString();
  });
  let userr = message.mentions.members.first() || message.member;
  let nick = userr.nickname;
  if (nick === null) nick = "//";
  let warns = await db.fetch(`warns_${message.guild.id}_${user.id}`);
  if (warns === null) warns = 0;
  let uInfoEmbed = new client.Discord.MessageEmbed()
    .setThumbnail(user.displayAvatarURL())
    .setAuthor(
      "Zdravo, " + message.author.username + "#" + message.author.discriminator,
      message.author.displayAvatarURL
    )
    .setDescription("__**Informacije o članu**__")
    .setColor(0x15f153)
    .addField("Korisničko ime", `${user.username}#${user.discriminator}`) // Their name, I use a different way, this should work
    .addField("Nick na serveru", `${nick}`)
    .addField("ID", user.id) // Their ID
    .addField("VIP", `${vip}`)
    .addField("Datum ulaska", userr.joinedAt) // When they joined
    .addField("Warnovi", warns)
    .addField("Uloge", userr.roles.cache.map(r => `${r}`).join(" | "), true)
    .setFooter(client.config.embed.footer)
    .setTimestamp();
  await message.channel.send(uInfoEmbed);
};
exports.help = {
  name: "info",
  description: "informacije o članu",
  usage: "info [@mention (neobavezno)]",
  category: "main",
  listed: true
};
