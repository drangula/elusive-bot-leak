const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let user = message.mentions.users.first() || message.author;

  let invites = await message.guild.fetchInvites();

  let inv = invites.array();

  let allinvites = 0,
    realinvites = 0,
    fakeinvites = 0;

  for (let i = 0; i < inv.length; i++) {
    if (inv[i].inviter.id === user.id) {
      allinvites += inv[i].uses;
      client.fetchInvite(inv[i].code).then(invite => {
        if (invite) realinvites += invite.uses;
        else fakeinvites += invite.uses;
      });
    }
  }

  let embed = new Discord.MessageEmbed()
    .setAuthor("Pozivnice člana " + user.tag, user.displayAvatarURL())
    .setColor("BLUE")
    .setDescription(
      "Broj svih pozivnica: __" +
        allinvites +
        "__\nBroj pravih pozivnica: __" +
        realinvites +
        "__\nBroj fake pozivnica: __" +
        fakeinvites +
        "__"
    )
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();

  message.channel.send(embed);
};
exports.help = {
  name: "invites",
  description: "broj invajtova",
  usage: "invites [@mention (neobavezno)]",
  category: "main",
  listed: true
};
