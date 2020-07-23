exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  if (client.cooldown.has(message.author.id))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Moraš sačekati 2h prije ponovnog mjenjanja nicka!`, color: 0x36393f}});
  const nick = args.join(" ");

  if (!nick) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi upisao/la odgovarajući nick!`, color: 0x36393f}});
  let starinick = message.member.nickname;
  if (starinick === null) starinick = "//";
  let nickEmbed = new client.Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setAuthor(
      message.author.username + " je promjenio/la svoj nick!",
      message.author.displayAvatarURL()
    )
    .setDescription(`**Stari nick:** ${starinick}\n**Novi nick:** ${nick}`);
  message.member
    .setNickname(nick)
    .then(() => message.channel.send(nickEmbed))
    .catch(err =>
      message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`"Nisam mogao promjeniti tvoj nick zbog: " + err`, color: 0x36393f}})
    );
  if (message.member.permissions.has("ADMINISTRATOR")) return;
  client.cooldown.add(message.author.id);
  setTimeout(() => {
    client.cooldown.delete(message.author.id);
  }, 7200000);
};
exports.help = {
  name: "nick",
  description: "mjenjanje nicka",
  usage: "nick [nick]",
  category: "main",
  listed: true
};
