exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("ADMINISTRATOR")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}})

  let reactionname = args[0];
  if (!reactionname) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la ime emoji-a`, color: 0x36393f}})
  let reaction = client.emojis.cache.find(r => r.name === reactionname);
  if (!reaction) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisam uspeo pronaci taj emoji`, color: 0x36393f}})

  let msgid = args[1];
  if (!msgid || isNaN(msgid))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la ID poruke`, color: 0x36393f}})
  let msg = await message.channel.messages
    .fetch(msgid)
    .catch(err => message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Ta poruka ne postoji!`, color: 0x36393f}}));

  let broj = args[2];
  if (!broj)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la vrstu reakcije!\n1 - stalna reakcija,\n2 - privremena reakcija (5s).`, color: 0x36393f}});
  if (isNaN(broj) || broj < 1 || broj > 3)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi pravilno napisao/la vrstu!`, color: 0x36393f}});

  if (broj == 1) {
    message.delete();
    msg.react(reaction);
  }
  if (broj == 2) {
    message.delete();
    msg.react(reaction).then(r => {
      setTimeout(() => r.remove(), 5000);
    });
  }
  if (broj == 3) {
    message.delete();
    client.emojis.forEach(em => {
      if (em.animated) msg.react(em);
    });
  }
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "react",
  description: "reagovanje na poruku",
  usage: "react [ime emojia] [ID poruke] [vrsta (1-2)]",
  category: "admin",
  listed: true
};
