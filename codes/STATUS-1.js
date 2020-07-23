const db = require("quick.db");

exports.load = async (client, message, args) => {
  let status = await db.fetch(`code_${message.guild.id}_status`);
  if (status === null || status.code == 1)
    return message.channel.send({embed:{title:`<:links:730777902810923058> **__Bot je na dužnosti!__**`,description:"**[10-5]** Bot je već na dužnosti!", color: 0x36393f}})
  else if (status.code == 3)
    return message.channel.send({embed:{title:`<:links:730777902810923058> **__Bot je već na pauzi, STATUS-4!__**`,description:"**[10-5]** Bot je na pauzi! Koristi `STATUS-4`", color: 0x36393f}});
  else if (status.code == 101) {
    let role = message.guild.roles.cache.get(status.role);
    db.set(`code_${message.guild.id}_status`, { code: 1 });
    let member = message.guild.members.cache.get(client.user.id);
    member.roles.remove(role).then(() => {
      role.delete();
    });
    member.setNickname(client.user.username);
    message.channel.send({embed:{title:`<:config:730778076472016927> **__ANTI-RAID!__**`,description:"**[10-4 - STATUS-1]** ANTI-RAID mod isključen!", color: 0x36393f}});
    message.guild.channels.cache.forEach(c => {
      c.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: null,
        ADD_REACTIONS: null
      });
    });
    let channel = message.guild.channels.cache.get("686582766485372955");
    if (channel) {
      channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: false
      });
    }
    return;
  }
  message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-4 - STATUS-1]** Bot na dužnosti!", color: 0x36393f}})
    .then(() => {
      let member = message.guild.members.cache.get(client.user.id);
      member.setNickname(client.user.username);
      db.set(`code_${message.guild.id}_status`, { code: 1 });
    })
    .catch(err => message.channel.send("**[10-5]** Greška:\n" + err));
};
