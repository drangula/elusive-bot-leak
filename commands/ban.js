exports.run = async (client, message, args) => {
  let allowed = false;
  let allowed2 = false;
  let conf = exports.conf;
  if (message.member.permissions.has("BAN_MEMBERS", false, false))
    allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) {
      allowed = true;
      allowed2 = true;
    }
  });

  if (!allowed)
    return    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Permisija__**`,description:`Nemaš permisiju za korišćenje ove komande!`, color: 0x36393f}})


  let member = message.mentions.members.first();

  if (!member)
    return    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Označi korisnika__**`,description:`Označi pravilnog korisnika servera kog želiš banovati!`, color: 0x36393f}})


  if (member.permissions.has("MANAGE_MESSAGES") && !allowed2)
    return    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Taj korisnik pripada Administraciji__**`,description:`Taj korisnik pripada Administraciji pa ga ne mogu banovati!`, color: 0x36393f}})

  if (!member.bannable)
      message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Ne mogu banovati korisnika ${member.tag} jer ima veci ili isti role kao ja`, color: 0x36393f}})


  let reason = args.slice(1).join(" ");

  if (!reason) reason = "Nisi napisao/la razlog.";

     // member.send({embed:{title:`<:ideban:729823019564007454> `,description:`Banovani ste sa **${message.guild} od strane **${message.author.tag}** zbog **${reason}**`, color: 0x36393f}})

  await member
    .ban(reason)

    .catch(error =>
      message.channel.send(
        `Izvinjavam se, ${message.author}. Nisam mogao banovati ovog člana zbog: ${error}`
      )
    );

      message.channel.send({embed:{title:`<:ideban:729823019564007454> `,description:`<:member:730777927389806695> **${member.user.tag}** je banovan/a od strane **${message.author.tag}** <:alert:730778124819628084> Razlog: **${reason}**`, color: 0x36393f}})

};
exports.conf = {
  allowed: ["649708455342505984", "495897264108339200"]
};
exports.help = {
  name: "ban",
  description: "banovanje članova",
  usage: "ban [@mention] [razlog]",
  category: "admin",
  listed: true
};
  