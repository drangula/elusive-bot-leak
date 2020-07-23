const db = require("quick.db");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});

  let user = message.mentions.users.first();
  if (!user) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi označio/la člana kom želiš skloniti warn!`, color: 0x36393f}});
  let member = message.guild.members.cache.get(user.id);

  let warns = args[1];
  if (!warns)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la broj warnova koje želiš očistiti!`, color: 0x36393f}});
  if (
    (isNaN(warns) && warns != "all") ||
    ((!isNaN(warns) && warns != "all" && warns < 1) || warns > 20)
  )
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi pravilno napisao/la broj warnova (1-20, all za sve)`, color: 0x36393f}});

  let membername = member.nickname;
  if (membername === null) membername = user.username;

  if (!isNaN(warns) && (warns > 0 || warns < 21)) {
    let memberwarns = await db.fetch(`warns_${message.guild.id}_${user.id}`);
    if (memberwarns === null || memberwarns == 0)
      return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Taj član nema nijedan warn!`, color: 0x36393f}});
    if (warns > memberwarns)
      return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Taj član nema toliko warnova (trenutno ih ima " + memberwarns + ")", color: 0x36393f}});
    db.subtract(`warns_${message.guild.id}_${user.id}`, Number(warns));
    memberwarns = await db.fetch(`warns_${message.guild.id}_${user.id}`);
    if (memberwarns == 0) db.delete(`warns_${message.guild.id}_${user.id}`);
    message.channel.send({embed:{title:`<:NewCheck:727103854478622813> **__Uspešno otklonjen warn!__**`,description:"Očistio/la si warnove članu " + membername + " (broj očišćenih warnova: " + warns + ")", color: 0x36393f}});
    let warnlogs = await db.fetch(`logs_${message.guild.id}_warnlogs`);
    if (warnlogs === null) return;
    warnlogs = client.channels.cache.get(warnlogs);
    if (warnlogs === undefined) return;
    let embed = new client.Discord.MessageEmbed()
      .setAuthor(
        message.author.username + " je očistio/la warnove članu " + membername,
        message.author.displayAvatarURL()
      )
      .setDescription("**Broj očišćenih warnova:** " + warns)
      .setThumbnail(user.displayAvatarURL())
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();
    warnlogs.send(embed);
  }
  if (isNaN(warns) && warns == "all") {
    let memberwarns = await db.fetch(`warns_${message.guild.id}_${user.id}`);
    if (memberwarns === null || memberwarns == 0)
      return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Taj član nema warnove.`, color: 0x36393f}});
    db.delete(`warns_${message.guild.id}_${user.id}`);
    message.channel.send({embed:{title:`<:NewCheck:727103854478622813> **__Uspešno otklonjeni warnovi!__**`,description:"Očistio/la si sve warnove članu " + membername, color: 0x36393f}});
    let warnlogs = await db.fetch(`logs_${message.guild.id}_warnlogs`);
    if (warnlogs === null) return;
    warnlogs = client.channels.cache.get(warnlogs);
    if (warnlogs === undefined) return;
    let embed = new client.Discord.MessageEmbed()
      .setAuthor(
        message.author.username + " je očistio sve warnove članu " + membername,
        message.author.displayAvatarURL()
      )
      .setThumbnail(user.displayAvatarURL())
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();
    warnlogs.send(embed);
  }
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "unwarn",
  description: "brisanje warnova članovima",
  usage: "unwarn [@mention] [broj (1-20) ili all]",
  category: "moderation",
  listed: true
};
