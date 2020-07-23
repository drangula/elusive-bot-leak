const slotItems = [
  ":grapes:",
  ":watermelon:",
  ":orange_circle:",
  ":apple:",
  ":carrot:",
  ":strawberry:",
  ":cherries:",
  ":kiwi:",
  ":lemon:",
];
const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("parse-ms");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037491922436238")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037491922436238>"
    );

  let user = message.author;
  let moneydb = await db.fetch(`money_${message.guild.id}_${user.id}`);
  let money = parseInt(args[0]);
  let win = false;
  let moneymore = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(
      `<:emoji_22:730779630390476850>  Nemaš dovoljno novca za korišćenje ove komande, proveri koliko imaš novca komandom **__!bal__**!`
    );  

  let moneyhelp = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(`<:alert:730778124819628084> Nisi napisao/la validan iznos koji želiš uložiti!!`);

  let incorrect = new Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setDescription(
      "<:alert:730778124819628084> Nije moguće korišćenje znakova u komandi **__!slots__**!"
    );

  if (!money) return message.channel.send(moneyhelp);
  if (money != args[0]) return message.channel.send(incorrect);
  if (money < 1) return message.channel.send("Nije moguće uložiti manje od **__1$__**");
  if (money > moneydb) return message.channel.send(moneymore);

  let number = [];
  for (let i = 0; i < 3; i++) {
    number[i] = Math.floor(Math.random() * slotItems.length);
  }

  if (number[0] == number[1] && number[1] == number[2]) {
    money *= 9;
    win = true;
  } else if (
    number[0] == number[1] ||
    number[0] == number[2] ||
    number[1] == number[2]
  ) {
    money *= 2;
    win = true;
  }
  if (win) {
    let slotsEmbed1 = new Discord.MessageEmbed()
      .setDescription(
        `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
          slotItems[number[2]]
        }\n\n Čestitam, uspešno si osvojio/la  **__${money}$__**`
      )
      .setColor("#FFFFFF");
    message.channel.send(slotsEmbed1);
    db.add(`money_${message.guild.id}_${user.id}`, money);
  } else {
    let slotsEmbed = new Discord.MessageEmbed()
      .setDescription(
        `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
          slotItems[number[2]]
        }\n\nNažalost si izgubio/la **__${money}$__**`
      )
      .setColor("#4CAAFF");
    message.channel.send(slotsEmbed);
    db.subtract(`money_${message.guild.id}_${user.id}`, money);
  }
};
exports.help = {
  name: "slots",
  description: "slot mašina",
  usage: "slots [iznos]",
  category: "economy",
  listed: true
};
