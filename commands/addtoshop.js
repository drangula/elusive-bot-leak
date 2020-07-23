const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Permisija__**`,description:"Nemaš permisiju za korištenje ove komande!", color: 0x36393f}});

  let items = await db
    .all()
    .filter(data => data.ID.startsWith(`shop_${message.guild.id}_`));
  if (items !== null && items.length === 20)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Šhop je popunjen__**`,description:"Dostigao/la si maksimalan broj stvari u shopu!", color: 0x36393f}});
  if (items === null) items = { length: 0 };

  let role = message.mentions.roles.first();
  if (!role)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nisi označio/la ulogu__**`,description:"Nisi označio/la ulogu koju želiš postaviti u shopu!", color: 0x36393f}});
  if (role.permissions.has("ADMINISTRATOR"))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Ova uloga ima Administratora!__**`,description:"Ne možeš postaviti ulogu koja ima permisiju administratora u shop!", color: 0x36393f}});

  let cijena = args[1];
  if (!cijena)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Upiši cenu__**`,description:"Nisi napisao/la cijenu za tu ulogu!", color: 0x36393f}});
  if (isNaN(cijena) || cijena < 1 || cijena > 100000)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Cijena ne može sadržiti znakove, biti veća od 100000$ ili manja od 1$", color: 0x36393f}});

  let slot = 0;

  for (let i = 1; i < 21; i++) {
    let shop = await db.fetch(`shop_${message.guild.id}_${i}`);
    if (shop === null) {
      slot = i;
      break;
    }
  }

  let roleinfo = {
    id: role.id,
    cijena: cijena,
    slot: slot
  };

  db.set(`shop_${message.guild.id}_${slot}`, roleinfo);
  message.channel.send(
    "Dodao/la si ulogu " +
      role.toString() +
      " na slotu " +
      slot +
      " u shop po cijeni od " +
      cijena +
      "$"
  );
};
exports.help = {
  name: "addtoshop",
  description: "dodavanje uloge u shop",
  usage: "addtoshop [@uloga] [cijena]",
  category: "admin",
  listed: true
};
