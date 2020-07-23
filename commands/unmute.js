const Discord = require("discord.js");
const db = require("quick.db");
const Timeout = require("smart-timeout");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});

  let member = message.mentions.members.first();
  if (!member) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nisi označio/la korisnika kojeg želiš odmutirati!`, color: 0x36393f}});
  let user = client.users.cache.get(member.id);

  let muted = message.guild.roles.cache.find(m => m.name === "Muted");
  if (!muted) {
    muted = await message.guild.roles
      .create({
        data: {
          name: "Muted",
          permissions: []
        }
      })
      .then(role => {
        message.guild.channels.cache.forEach(channel => {
          channel.updateOverwrite(role.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      });
  }
  if (!member.roles.cache.has(muted.id))
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Taj korisnik nije mutiran!`, color: 0x36393f}});

  let i = 0;
  let logs = await db.fetch(`logs_${message.guild.id}_msglogs`);
  if (logs === null) i++;
  if (i == 0) logs = message.guild.channels.cache.get(logs);
  if (logs === undefined || logs === null) i++;

  let embed = new Discord.MessageEmbed()
    .setAuthor(
      message.author.tag + " je odmutirao/la člana " + user.tag,
      message.author.displayAvatarURL()
    )
    .setThumbnail(user.displayAvatarURL())
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();
  if (i == 0) logs.send(embed);

  member.roles
    .remove(muted)
    .then(async () => {
      if (Timeout.exists("mute_" + message.guild.id + "_" + user.id))
        Timeout.clear("mute_" + message.guild.id + "_" + user.id);
      let mutetime = await db.fetch(`mutetime_${message.guild.id}_${user.id}`);
      if (mutetime !== null)
        db.delete(`mutetime_${message.guild.id}_${user.id}`);
      message.channel.send({embed:{title:`<:NewCheck:727103854478622813> **__Odmutiran__**`,description:"Odmutirao/la si korisnika " + member.toString(), color: 0x36393f}});
    })
    .catch(err =>
      message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:"Nisam mogao odmutirati tog korisnika zbog: " + err, color: 0x36393f}})
    );
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "unmute",
  description: "odmutiranje članova",
  usage: "unmute [@mention]",
  category: "moderation",
  listed: true
};
