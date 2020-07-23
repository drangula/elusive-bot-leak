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
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});

  let user = message.mentions.members.first();
  let userr = message.mentions.users.first();
  if (!userr)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nisi označio/la člana__**`,description:`Nisi označio/la člana kojem želiš dati novac!`, color: 0x36393f}});
  if (userr.bot) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Ne možeš botu dati novac__**`,description:`Ne možeš botu dati novac!`, color: 0x36393f}});

  if (!user)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__** **__Nisi označio člana__**`,description:`Nisi označio/la člana kojem želiš dati novac!`, color: 0x36393f}});
  let ec = parseInt(args[1], 10);
  if (!ec)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Nepravilan iznos__**`,description:`Nisi napisao/la pravilan iznos novca kojeg želiš dodati tom članu!`, color: 0x36393f}});
  if (ec < 1 || ec > 100000)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Unesi pravilan iznos__**`,description:`Ne možeš dati manje od 1$ ili više od 100000$`, color: 0x36393f}});
  db.add(`money_${message.guild.id}_${user.id}`, ec);
  let bal = await db.fetch(`money_${message.guild.id}_${user.id}`);

  let moneyEmbed = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(
      `<:Da:720248621701791805> Dodano ${ec}$ članu ${user}\n\nNovo stanje: ${bal}$`
    );
  message.channel.send(moneyEmbed);
};

exports.help = {
  name: "am",
  description: "davanje novca korisnicima",
  usage: "am [@mention] [količina]",
  category: "economy-a",
  listed: true
};
