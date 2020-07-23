const ms = require("ms");

exports.run = async (client, message, args) => {
  let allowed = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_CHANNELS")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) allowed = true;
  });

  if (!allowed)
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:"Nemaš permisiju za korištenje ove komande!", color: 0x36393f}});

  if (!client.lockit) client.lockit = [];
  let time = args.join(" ");
  let validUnlocks = ["release", "unlock"];
  if (!time)
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:"Moraš napisati dužinu lockdowna u satima, minutama ili sekundama!", color: 0x36393f}});
  if (isNaN(time))
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:"Nisi pravilno napisao/la dužinu vremena!", color: 0x36393f}})

  if (time == -1) {
    message.channel
      .updateOverwrite(message.guild.id, {
        SEND_MESSAGES: false
      })
      .then(() =>
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:"**__Kanal je zaključan na neodređeno__**!", color: 0x36393f}})
      );
    return;
  }

  if (time == 0) {
    message.channel
      .updateOverwrite(message.guild.id, {
        SEND_MESSAGES: null
      })
      .then(() => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:`**__Lockdown u ovom kanalu je završen!__**`, color: 0x36393f}})
        clearTimeout(client.lockit[message.channel.id]);
        delete client.lockit[message.channel.id];
      });
    return;
  }

  if (time < 10000 || time > 36000000)
    return message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:`Ne možeš zaključati kanal kraće od 10s ili duže od 1h!`, color: 0x36393f}});

  if (validUnlocks.includes(time)) {
    message.channel
      .updateOverwrite(message.guild.id, {
        SEND_MESSAGES: null
      })
      .then(() => {
        message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:`Lockdown završen!`, color: 0x36393f}});
        clearTimeout(client.lockit[message.channel.id]);
        delete client.lockit[message.channel.id];
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    message.channel
      .updateOverwrite(message.guild.id, {
        SEND_MESSAGES: false
      })
      .then(() => {
        message.channel
          .send(`**Kanal zaključan** na ${ms(ms(time), { long: true })}.`)
          .then(() => {
            client.lockit[message.channel.id] = setTimeout(() => {
              message.channel
                .updateOverwrite(message.guild.id, {
                  SEND_MESSAGES: null
                })
                .then(message.channel.send({embed:{title:`<:config:730778076472016927> **__Status kanala__**`,description:`Lockdown završen!`, color: 0x36393f}}))
                .catch(console.error);
              delete client.lockit[message.channel.id];
            }, ms(time));
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "lockdown",
  description: "zaključavanje kanala",
  usage: "lockdown [vrijeme u ms]",
  category: "admin",
  listed: true
};
