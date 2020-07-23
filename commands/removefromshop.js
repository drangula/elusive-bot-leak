const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Permisija__**`,description:"Nemaš permisiju za korištenje ove komande!", color: 0x36393f}});

  let items = await db
    .all()
    .filter(data => data.ID.startsWith(`shop_${message.guild.id}_`));
  if (items === null) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Shop je prazan!", color: 0x36393f}});

  let slot = args[0];
  if (!slot) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Ispiši validan slot__**`,description:"Nisi napisao/la slot iz kojeg želiš ukloniti ulogu!", color: 0x36393f}});
  if (isNaN(slot) || slot < 1 || slot > 20)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Slot ne može sadržavati znakove, biti veći od 20 ili manji od 1!", color: 0x36393f}});

  let role = await db.fetch(`shop_${message.guild.id}_${slot}`);

  if (role === null)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"U shopu se ne nalazi uloga sa tim IDom!", color: 0x36393f}});
  else {
    db.delete(`shop_${message.guild.id}_${slot}`);
    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Uloga je obrisana__**`,description:"Obrisao/la si ulogu na slotu " + slot + " iz shopa!", color: 0x36393f}});
  }
};
exports.help = {
  name: "removefromshop",
  description: "izbacivanje uloge iz shopa",
  usage: "removefromshop [slot]",
  category: "admin",
  listed: true
};
