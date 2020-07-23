const db = require("quick.db");

exports.load = async (client, message, args) => {
  let status = await db.fetch(`code_${message.guild.id}_status`);
  if (status !== null && status.code == 2)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Status bota je već `STATUS-2`", color: 0x36393f}});
  else if (status !== null && status.code == 3)
    return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-5]** Bot je na pauzi! Koristi `STATUS-4`", color: 0x36393f}});
  message.channel.send({embed:{title:`<:alert:730778124819628084> **__Podešavanje statusa!__**`,description:"**[10-4 - STATUS-2]** Bot na mirovanju!", color: 0x36393f}})
    .then(() => {
      let member = message.guild.members.cache.get(client.user.id);
      member.setNickname("🌙 " + client.user.username);
      db.set(`code_${message.guild.id}_status`, { code: 2 });
    })
    .catch(err => message.channel.send("**[10-5]** Greška:\n" + err));
};
