exports.run = (client, message, args) => {
  var allowedToUse = false;

  client.dev_ids.forEach(id => {
    if (message.author.id == id) allowedToUse = true;
  });

  if (allowedToUse) {
    let invites = ["ignore me"],
      ct = 0;

    client.guilds.forEach(g => {
      g.fetchInvites()
        .then(guildInvites => {
          invites[invites.length + 1] =
            g + " - `Pozivnice: " + guildInvites.array().join(", ") + "`";

          ct++;

          if (ct >= client.guilds.size) {
            invites.forEach((invite, i) => {
              if (invite == undefined) invites.splice(i, 1);
            });

            invites.shift();

            invites.forEach((invite, i) => (invites[i] = "- " + invite));

            invites = invites.join("\n\n");

            let embed = new client.Discord.MessageEmbed()

              .setTitle("Sve pozivnice:")

              .setDescription(invites);

            message.channel.send(embed);
          }
        })
        .catch(err => {
          ct++;
        });
    });
  } else {
    message.reply("ovu komandu može koristiti samo developer!");
  }
};
exports.help = {
  name: "serverinvites",
  description: "ispis invite linkova sa svih servera",
  usage: "serverinvites",
  category: "dev",
  listed: false
};
