const db = require("quick.db");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES", false, false))
    allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Nemaš permisiju za korištenje ove komande!`, color: 0x36393f}});

  let deleteCount = parseInt(args[0], 10); // Ooooh nice, combined conditions. <3

  if (!deleteCount || deleteCount < 1 || deleteCount > 100)
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Brisanje poruka__**`,description:`Napiši broj poruka koje želiš izbrisati (1-100).`, color: 0x36393f}}); // So we get our messages, and delete them. Simple enough, right?

  if (deleteCount != 100) deleteCount++;

  let fetched = await message.channel.messages.fetch({ limit: deleteCount });

  message.channel
    .bulkDelete(fetched)
    .then(async () => {
      let msg = "poruke";
      if (deleteCount != 100) deleteCount--;
      if (deleteCount == 1) msg = "poruku";
      let clearEmbed = new client.Discord.MessageEmbed()
        .setColor("#4CAAFF")
        .setAuthor(
          message.author.username +
            " je izbrisao/la " +
            msg +
            " u ovom kanalu!",
          message.author.displayAvatarURL()
        )
        .setDescription("**Broj izbrisanih poruka**: " + deleteCount);
      let i = 0;
      let logs = await db.fetch(`logs_${message.guild.id}_msglogs`);
      if (logs === null) i++;
      logs = client.channels.cache.get(logs);
      if (logs === undefined || logs === null) i++;
      if (message.channel !== logs) {
        let logsEmbed = new client.Discord.MessageEmbed()
          .setColor("#4CAAFF")
          .setAuthor(
            message.author.username +
              " je koristio komandu " +
              client.config.prefix +
              "clear",
            message.author.displayAvatarURL()
          )
          .setDescription("**Kanal:** " + message.channel.name)
          .addField("Broj obrisanih poruka", `${deleteCount}`)
          .setFooter(client.config.embed.footer)
          .setTimestamp();
        if (i == 0) logs.send(logsEmbed);
      }
      message.channel
        .send(clearEmbed)
        .then(msg => msg.delete({ timeout: 3000 }));
    })

    .catch(error =>
      message.reply(`nisam mogao izbrisati poruke zbog: ${error}`)
    );
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "clear",
  description: "brisanje poruka",
  usage: "clear [broj (1-100)]",
  category: "moderation",
  listed: true
};
