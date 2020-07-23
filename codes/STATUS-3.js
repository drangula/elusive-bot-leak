const db = require("quick.db");
const Timeout = require("smart-timeout");

exports.load = async (client, message, args) => {
  let status = await db.fetch(`code_${message.guild.id}_status`);
  if (status !== null && status.code == 3)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Status bota je već `STATUS-3`", color: 0x36393f}});
  else if (status !== null && status.code == 2)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Bot je na `STATUS_2`! Koristi `STATUS-1`", color: 0x36393f}});
  message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-4 - STATUS-3]** Bot na pauzi 15min!", color: 0x36393f}})
    .then(() => {
      let member = message.guild.members.cache.get(client.user.id);
      member.setNickname("🌙 " + client.user.username);
      db.set(`code_${message.guild.id}_status`, {
        code: 3,
        time: 900000,
        date: Date.now(),
        channel: message.channel.id
      });
      Timeout.set(
        "status_3_" + message.guild.id,
        () => {
          message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[STATUS-3]** Završen!", color: 0x36393f}}).then(() => {
            member.setNickname(client.user.username);
            db.set(`code_${message.guild.id}_status`, { code: 1 });
          });
        },
        900000
      );
    })
    .catch(err => message.channel.send("**[10-5]** Greška:\n" + err));
};
