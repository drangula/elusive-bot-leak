exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("ADMINISTRATOR")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});

  let emojiname = args[0];
  if (!emojiname) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la ime emojia!`, color: 0x36393f}});
  let emoji = client.emojis.cache.find(em => em.name === emojiname);
  if (!emoji) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Taj emoji ne postoji!`, color: 0x36393f}});
  message.delete();
  if (!emoji.animated)
    return message.channel.send("<:" + emoji.name + ":" + emoji.id + ">");
  message.channel.send("<a:" + emoji.name + ":" + emoji.id + ">");
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "emoji",
  description: "slanje emojia preko bota",
  usage: "emoji [ime emojia]",
  category: "admin",
  listed: true
};
