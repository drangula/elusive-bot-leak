exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  // Calculates ping between sending a message and editing it, giving a nice round-trip latency.

  // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

  const m = await message.channel.send("Ping?");

  m.edit(
    `Pong :)! Latencija je ${m.createdTimestamp -
      message.createdTimestamp}ms. API latencija je ${Math.round(
      client.ping
    )}ms.`
  );
};
exports.help = {
  name: "ping",
  description: "pinganje bota",
  usage: "ping",
  category: "main",
  listed: true
};
