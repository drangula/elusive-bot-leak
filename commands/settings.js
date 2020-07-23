const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.dev.id) return;
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send("Nemaš permisiju za korištenje ove komande!");

  let one = "1️⃣",
    two = "2️⃣",
    three = "3️⃣",
    four = "4️⃣",
    five = "5️⃣",
    negative = "❌";

  message.delete();

  let msgEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "Zdravo, " + message.author.tag,
      message.author.displayAvatarURL()
    )
    .setDescription(
      "Vrstu postavke biraš reakcijom na brojeve! Imaš 30 sekundi za biranje reakcije!"
    )
    .addField("1. Generalne postavke", "Prefix,\n" + "poruka za nove članove")
    .addField(
      "2. Postavke kanala",
      "Kanali za logging poruka, join/leave i warn"
    )
    .addField("3. Global Unban", "Unbanovanje svih korisnika")
    .addField("4. Global Unwarn", "Unwarnovanje svih korisnika")
    .addField(
      "5. Postavke ekonomije",
      "Uključivanje/isključivanje ekonomije,\n" +
        "postavljanje kanala za work, daily-weekly i gambling,\n" +
        "postavljanje valute,\n" +
        "resetovanje novca svih korisnika"
    )
    .setThumbnail(message.guild.iconURL())
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();

  let loadingEmbed = new Discord.MessageEmbed().setTitle("Učitavanje...");

  let msg = await message.channel.send(loadingEmbed);
  await msg.react(one);
  await msg.react(two);
  await msg.react(three);
  await msg.react(four);
  await msg.react(five);
  await msg.react(negative);

  msg.edit(msgEmbed);

  msg
    .awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        (reaction.emoji.name === one ||
          reaction.emoji.name === two ||
          reaction.emoji.name === three ||
          reaction.emoji.name === four ||
          reaction.emoji.name === five ||
          reaction.emoji.name === negative),
      { max: 1, time: 30000 }
    )
    .then(async em => {
      if (em.first().emoji.name === one) {
        msg.reactions.forEach(r => {
          if (r.emoji.name === one) return r.remove(message.author.id);
          if (r.emoji.name === two) return;
          if (r.emoji.name === negative) return;
          r.remove();
        });

        let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
        if (prefix === null) prefix = client.config.prefix;

        let welcomemsg = await db.fetch(
          `settings_${message.guild.id}_welcomemsg`
        );
        let welcome = "Nije postavljena";
        if (welcomemsg !== null) welcome = "Postavljena";

        let msg1Embed = new Discord.MessageEmbed()
          .setAuthor(
            "Zdravo, " + message.author.tag,
            message.author.displayAvatarURL()
          )
          .setDescription(
            "Vrstu postavke biraš reakcijom na brojeve! Imaš 30 sekundi za biranje reakcije!"
          )
          .addField("1. Prefix", "Trenutni prefix: " + prefix)
          .addField("2. Poruka za nove članove", welcome)
          .setThumbnail(message.guild.iconURL())
          .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
          .setTimestamp();
        msg.edit(msg1Embed);

        msg
          .awaitReactions(
            (reaction, user) =>
              user.id === message.author.id &&
              (reaction.emoji.name === one ||
                reaction.emoji.name === two ||
                reaction.emoji.name === negative),
            { max: 1, time: 30000 }
          )
          .then(async em => {
            if (em.first().emoji.name === one) {
              msg.reactions.forEach(r => {
                if (r.emoji.name === one) return r.remove(message.author.id);
              });

              let msg11Embed = new Discord.MessageEmbed()
                .setAuthor(
                  "Zdravo, " + message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setDescription(
                  "Vrstu postavke biraš reakcijom na brojeve! Imaš 30 sekundi za biranje reakcije!"
                )
                .addField(
                  "1. Postavljanje/mjenjanje prefixa",
                  "Postavljanje ili mijenjanje prefixa bota!"
                )
                .addField(
                  "2. Resetovanje prefixa",
                  "Resetovanje prefixa bota na zadani prefix (" +
                    client.config.prefix +
                    ")"
                )
                .setThumbnail(message.guild.iconURL())
                .setFooter(
                  client.config.embed.footer,
                  client.user.displayAvatarURL()
                )
                .setTimestamp();
              msg.edit(msg11Embed);

              msg
                .awaitReactions(
                  (reaction, user) =>
                    user.id === message.author.id &&
                    (reaction.emoji.name === one ||
                      reaction.emoji.name === two ||
                      reaction.emoji.name === negative),
                  { max: 1, time: 30000 }
                )
                .then(async em => {
                  if (em.first().emoji.name === one) {
                    msg.reactions.forEach(r => {
                      if (r.emoji.name === one) {
                        r.remove(message.author.id);
                        r.remove();
                        return;
                      }
                      if (r.emoji.name === negative) return;
                      r.remove();
                    });
                    let msg111Embed = new Discord.MessageEmbed()
                      .setAuthor(
                        "Zdravo, " + message.author.tag,
                        message.author.displayAvatarURL()
                      )
                      .setDescription(
                        "Sada napiši novi prefix za server ili reaguj sa X da odustaneš! Imaš 30 sekundi."
                      )
                      .setThumbnail(message.guild.iconURL())
                      .setFooter(
                        client.config.embed.footer,
                        client.user.displayAvatarURL()
                      )
                      .setTimestamp();
                    msg.edit(msg111Embed);
                    let awaiting = 0;
                    message.channel
                      .awaitMessages(
                        m => m.author.id === message.author.id && awaiting == 0,
                        { max: 1, time: 30000 }
                      )
                      .then(async np => {
                        if (np.first().content.length > 3) {
                          np.first().delete();
                          msg.delete();
                          message.channel
                            .send("Dužina prefixa ne može biti veća od 3!")
                            .then(msg => msg.delete({ timeout: 5000 }));
                          return;
                        } else if (np.first().content == client.config.prefix) {
                          np.first().delete();
                          msg.delete();
                          message.channel
                            .send(
                              "Za zadani prefix (" +
                                client.config.prefix +
                                ") umjesto postavljanja prefixa idi na opciju resetovanja!"
                            )
                            .then(msg => msg.delete({ timeout: 5000 }));
                          return;
                        } else {
                          np.first().delete();
                          let newprefix = np.first().content;
                          db.set(
                            `settings_${message.guild.id}_prefix`,
                            newprefix
                          ).then(() => {
                            let embed = new Discord.MessageEmbed().setTitle(
                              "Postavio/la si prefix na: " + newprefix
                            );
                            msg.edit(embed).then(msg => {
                              msg.reactions.removeAll();
                              msg.delete({ timeout: 5000 });
                            });
                          });
                          return;
                        }
                      })
                      .catch(() => {
                        if (awaiting == 0) {
                          msg.delete();
                          message.channel
                            .send("Isteklo je vrijeme za odgovor!")
                            .then(msg => msg.delete({ timeout: 5000 }));
                        }
                      });
                    msg
                      .awaitReactions(
                        (reaction, user) =>
                          user.id === message.author.id &&
                          reaction.emoji.name === negative,
                        { max: 1 }
                      )
                      .then(() => {
                        awaiting++;
                        msg.delete();
                      });
                  } else if (em.first().emoji.name === two) {
                    let prefix = await db.fetch(
                      `settings_${message.guild.id}_prefix`
                    );
                    if (prefix === null) {
                      msg.delete();
                      message.channel
                        .send("Na ovom serveru je već zadani prefix!")
                        .then(msg => msg.delete({ timeout: 5000 }));
                      return;
                    }
                    db.delete(`settings_${message.guild.id}_prefix`).then(
                      () => {
                        msg.delete();
                        let embed = new Discord.MessageEmbed().setTitle(
                          "Resetovao si prefix na " + client.config.prefix
                        );
                        message.channel.send(embed).then(msg => {
                          msg.reactions.removeAll();
                          msg.delete({ timeout: 5000 });
                        });
                      }
                    );
                  } else return msg.delete();
                })
                .catch(() => {
                  msg.delete();
                  message.channel
                    .send("Isteklo je vrijeme za reakciju!")
                    .then(msg => msg.delete({ timeout: 5000 }));
                });
            } else if (em.first().emoji.name === two) {
              return;
            } else return msg.delete();
          })
          .catch(() => {
            msg.delete();
            message.channel
              .send("Isteklo je vrijeme za reakciju!")
              .then(msg => msg.delete({ timeout: 5000 }));
          });
      } else return msg.delete();
    })
    .catch(() => {
      msg.delete();
      message.channel
        .send("Isteklo je vrijeme za reakciju!")
        .then(msg => msg.delete({ timeout: 5000 }));
    });
};
exports.help = {
  name: "settings",
  description: "postavke servera",
  usage: "settings",
  category: "admin",
  listed: false
};
