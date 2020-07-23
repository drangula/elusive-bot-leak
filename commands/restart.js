exports.run = (client, message, args) => {
  if (
    message.author.id !== client.config.dev.id &&
    message.author.id !== "649708455342505984"
  )
    return;
  message.channel.send({embed:{title:`<:config:730778076472016927> **__Restart započet__**`,description:`Bot je uspešno restartovan! <:emoji_23:730779605903999038>`, color: 0x36393f}}).then(() => {
    process.exit(1);
  });
};
exports.help = {
  name: "restart",
  description: "restartovanje bota",
  usage: "restart",
  category: "dev",
  listed: false
};
