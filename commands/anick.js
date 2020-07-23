exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_NICKNAMES", false, false))
    allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x4CAAFF}});

  let tagged = message.mentions.users.first();
  if (tagged === message.author)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Ukoliko želiš promeniti svoj nick koristi **" + client.config.prefix + "nick**!", color: 0x4CAAFF}});
  let taggedmember = message.mentions.members.first();
  if (!tagged) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisi pravilno označio/la **__člana__** kom želiš promeniti ime!", color: 0x4CAAFF}});
  let nick = args.slice(1).join(" ");
  if (!nick)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisi napisao/la nick koji želiš dodijeliti tom članu!", color: 0x4CAAFF}});
  let starinick = taggedmember.nickname;
  if (starinick === null) starinick = "//";
  let nickEmbed = new client.Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setAuthor(
      message.author.username +
        " je promjenio/la nick članu " +
        tagged.username +
        ".",
      message.author.displayAvatarURL
    )
    .setDescription(`**Stari nick:** ${starinick}\n**Novi nick:** ${nick}`);
  message.guild
    .member(tagged)
    .setNickname(nick)
    .then(() => message.channel.send(nickEmbed))
    .catch(err =>
      message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisam mogao promjeniti nick tog člana zbog: " + err, color: 0x4CAAFF}})
    );
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "anick",
  description: "mjenjanje nicka članovima",
  usage: "anick [@mention] [nick]",
  category: "moderation",
  listed: true
};
