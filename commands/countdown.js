const Discord = require("discord.js");
const delay = require("delay");

exports.run = async (client, message, args) => {
  let broj = args[0];
  if (!broj) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi napisao/la broj`, color: 0x36393f}})
  if (isNaN(broj) || broj < 1 || broj > 20)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Broj ne smije sadržiti znakove, ne smije biti manji od 1 i veći od 20!`, color: 0x36393f}})
  let embed = new Discord.MessageEmbed().setDescription(broj);
  let msg = await message.channel.send(embed);
  broj--;
  for (let i = broj; i > 0; i--) {
    embed = new Discord.MessageEmbed().setDescription(i);
    await delay(1000);
    msg.edit(embed);
  }
};
exports.help = {
  name: "countdown",
  description: "odbrojavanje",
  usage: "countdown [broj (1-20)]",
  category: "main",
  listed: true
};
