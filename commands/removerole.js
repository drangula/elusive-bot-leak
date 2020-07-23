exports.run = (client, message, args) => {
  let allowed = false;
  let allowed2 = false;
  let conf = exports.conf;
  if (message.member.permissions.has("ADMINISTRATOR")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) {
      allowed = true;
      allowed2 = true;
    }
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Permisija__**`,description:"Nemaš permisiju za korištenje ove komande!", color: 0x36393f}});

  let member = message.mentions.members.first();
  if (!member) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Označi korisnika__**`,description:"Nisi označio/la korisnika kom želiš oduzeti ulogu!", color: 0x36393f}});

  let role = message.mentions.roles.first() || args[1];
  if (!message.mentions.roles.first() && args[1])
    role = message.guild.roles.cache.find(r =>
      r.name.toLowerCase().includes(args[1].toLowerCase())
    );
  else if (!message.mentions.roles.first() && !args[1])
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisi označio ulogu ili napisao njeno ime!", color: 0x36393f}});
  if (!role) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Ta uloga ne postoji!", color: 0x36393f}});

  let bot = message.guild.members.cache.get(client.user.id).roles.highest;
  if (role.position > bot.position)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Ta uloga je na većoj poziciji od uloge bota!", color: 0x36393f}});
  if (
    message.member.roles.highest.position < role.position &&
    message.author.id !== message.guild.ownerID &&
    !allowed2
  )
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Ta uloga je na većoj poziciji od uloge bota!", color: 0x36393f}});

  if (!member.roles.cache.has(role.id))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:member.toString() + " nema tu ulogu koju želiš oduzeti!", color: 0x36393f}});

  member.roles
    .remove(role)
    .then(() =>
      message.channel.send({embed:{title:`<:NewCheck:727103854478622813> **__Uspešno ste oduzeli ulogu!__**`,description:"Oduzeo/la si ulogu korisniku " + role.name + " članu " + member.toString(), color: 0x36393f}})
    )
    .catch(err =>
      message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisam mogao dati ulogu tom korisniku zbog: " + err, color: 0x36393f}})
    );
};
exports.conf = {
  allowed: ["649708455342505984", "447324949061828608"]
};
exports.help = {
  name: "removerole",
  description: "skidanje uloge članovima",
  usage: "removerole [@mention] [@uloga]",
  category: "admin",
  listed: true
};
