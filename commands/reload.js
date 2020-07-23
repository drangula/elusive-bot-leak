exports.run = (client, message, args) => {
  if (message.author.id !== client.config.dev.id) return;
  if (!args || args.length < 1)
    return message.channel.send("Napiši koju komandu želiš reloadati!");
  const commandName = args[0];
  // Check if the command exists and is valid
  if (!client.commands.has(commandName)) {
    return message.channel.send("Ta komanda ne postoji!");
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${commandName}.js`)];
  // We also need to delete and reload the command from the client.commands Enmap
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  message.channel.send(`Komanda ${commandName} je reloadana!`);
};
exports.help = {
  name: "reload",
  description: "reloadanje komande",
  usage: "reload [ime komande]",
  category: "dev",
  listed: false
};
