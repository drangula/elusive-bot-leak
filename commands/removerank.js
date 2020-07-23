exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("ADMINISTRATOR")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send("Nemaš permisiju za korištenje ove komande!");

  let bronze = message.guild.roles.cache.get(client.server.bronzevip);
  let silver = message.guild.roles.cache.get(client.server.silvervip);
  let gold = message.guild.roles.cache.get(client.server.goldvip);
  let platinum = message.guild.roles.cache.get(client.server.platinumvip);

  let user = message.mentions.members.first();
  let userr = message.mentions.users.first();
  if (userr.bot)
    return message.channel.send("Ne možeš oduzimati VIP rank botu!");

  if (!user)
    return message.channel.send(
      "Nisi označio/la člana kojem želiš oduzeti rank!"
    );

  if (user.roles.has(bronze.id)) user.removeRole(bronze);
  if (user.roles.has(silver.id)) user.removeRole(silver);
  if (user.roles.has(gold.id)) user.removeRole(gold);
  if (user.roles.has(platinum.id)) user.removeRole(platinum);
  if (
    !user.roles.has(bronze.id) &&
    !user.roles.has(silver.id) &&
    !user.roles.has(gold.id) &&
    !user.roles.has(platinum.id)
  )
    return message.channel.send(`Član ${user} nema nikakav rank!`);
  message.channel.send(`Članu ${user} je izbrisan rank!`);
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "removerank",
  description: "skidanje ranka članovima",
  usage: "removerank [@mention] [broj (1-4)]",
  category: "economy-a",
  listed: true
};
