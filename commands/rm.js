const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  let ownerID = ["490605344892911627", "649708455342505984", "447324949061828608"];
  var allowed = false;
  ownerID.forEach(id => {
    if (message.author.id == id) {
      allowed = true;
    }
  });

  if (allowed != true)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nemaš permisiju za korišćenje ove komande__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});
  let user = message.mentions.members.first();
  let userr = message.mentions.users.first();
  if (userr.bot) return message.channel.send("Ne možeš oduzeti novac botu!");
  if (!user)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nisi označio/la člana__**`,description:`Nisi označio/la člana kojem želiš oduzeti novac!`, color: 0x36393f}});
  let ec = parseInt(args[1], 10);
  if (!ec)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nisi napisao/la iznos__**`,description:`Nisi napisao/la količinu novca koje želiš oduzeti članu!`, color: 0x36393f}});
  if (ec < 1) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nije moguće oduzeti manje od 1$__**`,description:`Ne možeš oduzeti manje od 1$`, color: 0x36393f}});
  db.subtract(`money_${message.guild.id}_${user.id}`, ec);
  let bal = await db.fetch(`money_${message.guild.id}_${user.id}`);

  let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(
      `<:Da:720248621701791805>  Oduzeto ${ec}$ članu ${user}\n\nNovo stanje: ${bal}$`
    );
  message.channel.send(moneyEmbed);
};
exports.help = {
  name: "rm",
  description: "oduzimanje novca članovima",
  usage: "rm [@mention] [iznos]",
  category: "economy-a",
  listed: true
};
