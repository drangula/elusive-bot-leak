exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.dev.id) return;
  let status = args.join(" ");
  if (!status)
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Promena statusa neuspesna!__**`,description:"Napiši koji status želiš postaviti!\n\n1. !setstatus on **( __*Aktivan*__ )**\n2. !setstatus idle **( __*AFK*__ )**\n3. !setstatus dnd **( __*Ne uznemiravaj*__ )**\n4. !setstatus off **( __*Neaktivan*__ )**", color: 0x4CAAFF}});

  if (status === "on") {
    client.user
      .setStatus("online")
      .then(async () => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Promena statusa!__**`,description:"Stavio si status bota na online!", color: 0x4CAAFF}});
        let fetch = await message.channel.messages.fetch({ limit: 2 });
        setTimeout(() => message.channel.bulkDelete(fetch), 3000);
      })
      .catch(err => console.log(err));
  } else if (status === "idle") {
    client.user
      .setStatus("idle")
      .then(async () => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Promena statusa!__**`,description:"Stavio si status bota na idle!", color: 0x4CAAFF}});
        let fetch = await message.channel.messages.fetch({ limit: 2 });
        setTimeout(() => message.channel.bulkDelete(fetch), 3000);
      })
      .catch(err => console.log(err));
  } else if (status === "dnd") {
    client.user
      .setStatus("dnd")
      .then(async () => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Promena statusa!__**`,description:"Stavio si status bota na do not disturb!", color: 0x4CAAFF}});
        let fetch = await message.channel.messages.fetch({ limit: 2 });
        setTimeout(() => message.channel.bulkDelete(fetch), 3000);
      })
      .catch(err => console.log(err));
  } else if (status === "off") {
    client.user
      .setStatus("invisible")
      .then(async () => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Promena statusa!__**`,description:"Stavio si status bota na offline!", color: 0x4CAAFF}});
        let fetch = await message.channel.messages.fetch({ limit: 2 });
        setTimeout(() => message.channel.bulkDelete(fetch), 3000);
      })
      .catch(err => console.log(err));
  } else {
    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Promena statusa neuspesna!__**`,description:"Nisi napisao pravilan status!", color: 0x4CAAFF}})
      .then(async () => {
        let fetch = await message.channel.messages.fetch({ limit: 2 });
        setTimeout(() => message.channel.bulkDelete(fetch), 3000);
      })
      .catch(err => console.log(err));
  }
};
exports.help = {
  name: "setstatus",
  description: "mjenjanje statusa bota",
  usage: "setstatus [vrsta]",
  category: "dev",
  listed: false
};
