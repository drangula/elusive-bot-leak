const Discord = require("discord.js");
const db = require("quick.db");
const guild = require("../supportguild.json");
const Timeout = require("smart-timeout");

module.exports = client => {
  console.log(
    `Bot je startovan, sa ${client.users.cache.size} korisnika, u ${client.channels.cache.size} kanala na ${client.guilds.cache.size} servera.`
  ); // Example of changing the bot's playing game to something useful. `client.user` is what the // docs refer to as the "ClientUser".

  client.user.setActivity(
    `${client.config.ime} || v${client.config.verzija} || ʙᴇᴛᴀ`
  );
  let server = client.guilds.cache.get(guild.id);
  if (server)
    client.channels.cache
      .get(guild.membercount)
      .setName("Member Count: " + server.memberCount);
  client.guilds.cache.forEach(gg => {
    (async () => {
      let status = await db.fetch(`code_${gg.id}_status`);
      if (status !== null && status.code == 3) {
        let time = status.time - (Date.now() - status.date);
        if (time > 0) {
          Timeout.set(
            "status_3_" + gg.id,
            () => {
              let member = gg.members.cache.get(client.user.id);
              gg.channels.cache
                .get(status.channel)
                .send("**[STATUS-3]** Završen!")
                .then(() => {
                  member.setNickname(client.user.username);
                  db.set(`code_${gg.id}_status`, { code: 1 });
                });
            },
            time
          );
        } else {
          let member = gg.members.cache.get(client.user.id);
          gg.channels.cache
            .get(status.channel)
            .send("**[STATUS-3]** Završen!")
            .then(() => {
              member.setNickname(client.user.username);
              db.set(`code_${gg.id}_status`, { code: 1 });
            });
        }
      }

      let mute = await db
        .all()
        .filter(data => data.ID.startsWith(`mutetime_${gg.id}`));
      for (let i = 0; i < mute.length; i++) {
        let e = 0;
        let userid = mute[i].ID.split("_")[2];
        let member = await gg.members.fetch(userid).catch(() => e++);
        if (e != 0) db.delete(mute[i].ID);
        else {
          let mutetime = await db.fetch(`mutetime_${gg.id}_${userid}`);
          let time = mutetime.time - (Date.now() - mutetime.date);
          if (time > 0) {
            Timeout.set(
              "mute_" + gg.id + "_" + userid,
              async () => {
                try {
                  let muted = gg.roles.cache.find(r => r.name === muted);
                  if (!muted) {
                    muted = await gg.roles
                      .create({
                        data: {
                          name: "Ovaj korisnik/ca je utišan/a!",
                          permissions: []
                        }
                      })
                      .then(role => {
                        gg.channels.cache.forEach(channel => {
                          channel.updateOverwrite(role.id, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                          });
                        });
                      });
                  }
                  member.roles.remove(muted).then(async () => {
                    let i = 0;
                    let user = client.users.cache.get(userid);
                    let channel = await db.fetch(
                      `mutetime_${gg.id}_${userid}`,
                      { target: ".channel" }
                    );
                    channel = gg.channels.cache.get(channel);
                    if (channel === undefined || channel === null) i++;
                    channel.send(
                      "<:links:730777902810923058> Istekao je privremeni mute člana " + user.tag
                    );

                    db.delete(`mutetime_${gg.id}_${userid}`);

                    i = 0;
                    let logs = await db.fetch(`logs_${gg.id}_msglogs`);
                    if (logs === null) i++;
                    if (i == 0) logs = gg.channels.cache.get(logs);
                    if (logs === undefined || logs === null) i++;

                    let embed = new Discord.MessageEmbed()
                      .setAuthor("<:links:730777902810923058> Istekao je privremeni mute člana " + user.tag)
                      .setThumbnail(user.displayAvatarURL())
                      .setFooter(
                        client.config.embed.footer,
                        client.user.displayAvatarURL()
                      )
                      .setTimestamp();
                    if (i == 0) logs.send(embed);
                  });
                } catch (err) {
                  console.log(err);
                }
              },
              time
            );
          } else {
            let muted = gg.roles.cache.find(r => r.name === "Ovaj korisnik/ca je utišan/a!");
            if (!muted) {
              muted = await gg.roles
                .create({
                  data: {
                    name: "Ovaj korisnik/ca je utišan/a!",
                    permissions: []
                  }
                })
                .then(role => {
                  gg.channels.cache.forEach(channel => {
                    channel.updateOverwrite(role.id, {
                      SEND_MESSAGES: false,
                      ADD_REACTIONS: false
                    });
                  });
                });
            }
            member.roles
              .remove(muted)
              .then(() => db.delete(`mutetime_${gg.id}_${userid}`));
          }
        }
      }
    })();
  });
};
