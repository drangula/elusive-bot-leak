exports.run = async (client, message, args, level) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("BAN_MEMBERS")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return    message.channel.send({embed:{title:`<:alert:730778124819628084>**__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!!`, color: 0x36393f}})

  try {
    const user = args[0];
    const settings = message.guild.id;

    if (user) {
      message.guild.members
        .unban(user)
        .then(() => {
          return    message.channel.send({embed:{title:`<:NewCheck:727103854478622813>**__Unbanovao/la si korisnika__**`,description:`*Uspešno si unbanovao/la korisnika sa servera* **__Elusive™ Community__**`, color: 0x36393f}})

          const modLogChannel = settings.modLogChannel;
          if (
            modLogChannel &&
            message.guild.channels.cache.find(
              c => c.name === settings.modLogChannel
            )
          ) {
            const embed = new client.Discord.MessageEmbed()
              .setTitle("Unban korisnika!")
              .setColor(client.config.embed.color)
              .setDescription(
                `ID korisnika: ${user}\nModerator: ${message.author.username}`
              );

            message.guild.channels.cache
              .find(c => c.name === settings.modLogChannel)
              .send(embed);
          }
        })
        .catch(err => {
          message.reply(`nisam mogao unbanovati korisnika zbog: ${err}`);
        });
    } else {
      return    message.channel.send({embed:{title:`<:alert:730778124819628084>**__Greška__**`,description:`Nisi uneo/la **__ID KORISNIKA__** kojeg želiš unbanovati`, color: 0x36393f}})
    }
  } catch (err) {
    message.channel.send("Pojavila se greška: " + err + "").catch();
  }
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "unban",
  description: "unbanovanje korisnika",
  usage: "unban [ID korisnika]",
  category: "admin",
  listed: true
};
