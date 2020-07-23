const guild = require("../supportguild.json");

module.exports = async (client, reaction, user) => {
  let message = reaction.message,
    emoji = reaction.emoji;
  let member = message.guild.members.cache.get(user.id);
  if (message.id !== guild.verify.message) return;
  if (emoji.name === "✅") {
    let role = message.guild.roles.cache.get(guild.member);
    if (!role) return;
    if (member.roles.has(role)) return;
    member.roles.add(role);
  }
};
