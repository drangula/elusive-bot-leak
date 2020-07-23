exports.run = (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("ADMINISTRATOR")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send("Nemaš permisiju za korištenje ove komande!");

  const sayMessage = args.join(" "); // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
  message.delete().catch(O_o => {}); // And we get the bot to say the thing:
  message.channel.send(sayMessage);
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "text",
  description: "ispis teksta preko bota",
  usage: "text [tekst]",
  category: "admin",
  listed: true
};
