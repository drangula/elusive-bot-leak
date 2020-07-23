const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let slot = args[0];
  if (!slot) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška pri kupovini!__**`,description:`Pogledajte katalog komandom **__!shop__**, zatim unesite broj uloge`, color: 0x36393f}});
  if (isNaN(slot) || slot < 1 || slot > 20)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Unesi pravilno slot iz šhopa kako bi kupio/la svoju ulogu.`, color: 0x36393f}});
  let novac = await db.fetch(`money_${message.guild.id}_${message.author.id}`);
  if (novac === null) novac = 0;
  let items = await db
    .all()
    .filter(data => data.ID.startsWith(`shop_${message.guild.id}_`))
    .sort((a, b) => JSON.parse(a.data).slot - JSON.parse(b.data).slot);
  if (items === null || items.length < 1)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Shop je trenutno prazan!`, color: 0x36393f}});
  let shop = await db.fetch(`shop_${message.guild.id}_${slot}`);
  if (shop === null)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nema uloge sa tim slotom u shopu!`, color: 0x36393f}});
  if (shop.cijena > novac)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemas dovoljno novca za tu ulogu`, color: 0x36393f}});
  let role = message.guild.roles.cache.get(shop.id);
  if (!role) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Ova uloga ne postoji na serveru!`, color: 0x36393f}});
  if (message.member.roles.cache.has(role.id))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Vec imas ovu ulogu!`, color: 0x36393f}});
  message.member.roles
    .add(role)
    .then(() => {
      db.subtract(
        `money_${message.guild.id}_${message.author.id}`,
        shop.cijena
      );
      message.channel.send({embed:{title:`<:novac:730778098680987739> **__Uspesna kupovina__**`,description:"Kupio/la si ulogu **" + role.name + "** za __" + shop.cijena + "$__", color: 0x36393f}});
    })
    .catch(err => {
      console.log(err);
      message.channel.send({embed:{title:`Nisam ti mogao dati tu ulogu`, color: 0x36393f}});
    });
};
exports.help = {
  name: "buy",
  description: "kupovina uloge iz shopa",
  usage: "buy [slot]",
  category: "economy",
  listed: true
};
