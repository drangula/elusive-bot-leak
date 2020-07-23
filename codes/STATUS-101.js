const db = require("quick.db");

exports.load = async (client, message, args) => {
  let status = await db.fetch(`code_${message.guild.id}_status`);
  if (status !== null && status.code == 101)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Status bota je već `STATUS-101`", color: 0x36393f}});
  else if (status !== null && status.code == 2)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Status bota je `STATUS-2`. Koristi `STATUS-1`", color: 0x36393f}});
  else if (status !== null && status.code == 3)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Bot je na pauzi! Koristi `STATUS-4`", color: 0x36393f}});
  message.channel.send({embed:{title:`<:alert:730778124819628084> **__ANTI-RAID!__**`,description:"**[10-4 - STATUS-101]** ANTI-RAID aktiviran!", color: 0x36393f}})
    .then(async () => {
      let member = message.guild.members.cache.get(client.user.id);
      member.setNickname("🛡 " + client.user.username);
      let role = await message.guild.roles.create({
        data: {
          name: "🛡 | Guard Mode",
          color: "DARK_BLUE",
          position: member.roles.highest.position - 1
        }
      });
      member.roles.add(role);
      db.set(`code_${message.guild.id}_status`, { code: 101, role: role.id });
      message.guild.channels.cache.forEach(c => {
        c.updateOverwrite(message.guild.id, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    })
    .catch(err => message.channel.send("**[10-5]** Greška:\n" + err));
};
