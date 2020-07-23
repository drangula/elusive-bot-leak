const db = require("quick.db");
const Timeout = require("smart-timeout");
const guild = require("../supportguild.json");

module.exports = async (client, member) => {
  if (member.guild.id === guild.id) {
    member.guild.channels.cache
      .get(guild.membercount)
      .setName("Member Count: " + member.guild.memberCount);
  }
  let memberdata = await db.all().filter(data => data.ID.includes(member.id));
  memberdata.forEach(data => db.delete(data.ID));
  if (Timeout.exists("mute_" + member.guild.id + "_" + member.id))
    Timeout.clear("mute_" + member.guild.id + "_" + member.id);
  let logs = await db.fetch(`logs_${member.guild.id}_memberlogs`);
  if (logs === null) return;
  logs = client.channels.cache.get(logs);
  if (logs === undefined || logs === null) return;
  let embed = new client.Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setAuthor(member.user.tag + " je napustio/la server!")
    .setFooter(client.config.embed.footer)
    .setTimestamp();
  logs.send(embed);
};
