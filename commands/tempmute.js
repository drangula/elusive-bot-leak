const Discord = require("discord.js");
const db = require("quick.db");
const Timeout = require("smart-timeout");

exports.run = async (client, message, args) => {
  let allowed = false;
  let allowed2 = false;
  let conf = exports.conf;
  if (message.member.permissions.has("MANAGE_MESSAGES")) allowed = true;
  conf.allowed.forEach(a => {
    if (!allowed && message.author.id === a) {
      allowed = true;
      allowed2 = true;
    }
  });

  if (!allowed)
    return    message.channel.send({embed:{title:`<:alert:730778124819628084> **__Permisija__**`,description:`Nemas permisiju za ovu komandu!!`, color: 0x36393f}})

  let member = message.mentions.members.first();
  if (!member) return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Označi korisnika__**`,description:`Označi korisnika kog želiš mutirati`, color: 0x36393f}})
  let user = client.users.cache.get(member.id);
  if (message.member === member)
   return message.channel.send({embed:{title:`<:alert:730778124819628084> **__Greška__**`,description:`Ne možete sami sebe mutirati!`, color: 0x36393f}})

  let StaffPermisija = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Ne možeš koristiti ovu komandu na Administraciji!")
        .setDescription("Ne možeš mutirati člana Administracije!")
          .setColor("RED")
  if (member.permissions.has("MANAGE_MESSAGES") && !allowed2)
    return message.channel.send(StaffPermisija); //u message.channel.send stavljas gore sta si napisao u ov

  let vrijeme = args[1];

 let Vreme = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Nisi ispisao pravilno vreme")
        .setDescription("Nisi napisao/la vrijeme u satima (h), minutama (m) ili sekundama (s)!"
)
          .setColor("RED")
  if (!vrijeme)

    return message.channel.send(
      Vreme
    );
  let vrijemeint = parseInt(args[1]);
  let VremeError = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Nisi ispisao pravilno vreme")
        .setDescription("Nisi pravilno napisao/la vrijeme.")
          .setColor("RED")

  if (
    (!vrijeme.includes("h") &&
      !vrijeme.includes("m") &&
      !vrijeme.includes("s")) ||
    vrijemeint < 0 ||
    vrijemeint > 60
  )

    return message.channel.send(VremeError);

  let time;

  let VremeError1 = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Nije moguće koristiti kombinaciju vremenskih oznaka")
        .setDescription("Ne možeš koristiti kombinaciju vremenskih oznaka!")
          .setColor("RED")

  if (
    vrijeme.includes("h") &&
    !vrijeme.includes("m") &&
    !vrijeme.includes("s")
  ) {
    time = vrijemeint * 3600000;
  } else if (
    vrijeme.includes("m") &&
    !vrijeme.includes("h") &&
    !vrijeme.includes("s")
  ) {
    time = vrijemeint * 60000;
  } else if (
    vrijeme.includes("s") &&
    !vrijeme.includes("h") &&
    !vrijeme.includes("m")
  ) {
    time = vrijemeint * 1000;
  } else
    return message.channel.send(
     VremeError1
    );

  let razlog = args.slice(2).join(" ");
  let EnterReason = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Nisi napisao/la razlog")
        .setDescription("Nisi napisao/la razlog!")
          .setColor("4CAAFF")
  if (!razlog) return message.channel.send(EnterReason);
  let ReasonLength = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Razlog je predug")
        .setDescription("Razlog je predug!")
          .setColor("4CAAFF")
  if (razlog.length > 100) return message.channel.send(ReasonLength);

  let muted = message.guild.roles.cache.find(m => m.name === "Muted");
  if (!muted) {
    muted = await message.guild.roles
      .create({
        data: {
          name: "Muted",
          permissions: []
        }
      })
      .then(role => {
        message.guild.channels.cache.forEach(channel => {
          channel.updateOverwrite(role.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      });
  }

 let AlreadyMuted = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Korisnik je već mutiran.")
        .setDescription("Taj korisnik je već mutiran!")
          .setColor("RED")
  if (member.roles.cache.has(muted.id))
    return message.channel.send(AlreadyMuted);
  let mutetime = await db.fetch(`mutetime_${message.guild.id}_${user.id}`);

 let AlreadyMuted1 = new Discord.MessageEmbed() 
    .setTitle("<:alert:730778124819628084> Korisnik je već mutiran.")
        .setDescription("Taj korisnik je već mutiran!")
          .setColor("RED")

  if (mutetime !== null)
    return message.channel.send(AlreadyMuted1);

  let i = 0;
  let logs = await db.fetch(`logs_${message.guild.id}_msglogs`);
  if (logs === null) i++;
  if (i == 0) logs = message.guild.channels.cache.get(logs);
  if (logs === undefined || logs === null) i++;

 let MuteSuccess = new Discord.MessageEmbed() 
    .setTitle("<:config:730778076472016927>  Uspešno si mutirao/la korisnika")
        .setDescription(`${message.author.tag} je mutirao ${user.tag} zbog {razlog}`)
          .setColor("02FDFD")

  let embed = new Discord.MessageEmbed()
    .setAuthor(
      message.author.tag + " je mutirao/la člana " + user.tag,
      message.author.displayAvatarURL()
    )
    .addField("Vrijeme", vrijeme)
    .addField("Razlog", razlog)
    .setThumbnail(user.displayAvatarURL())
    .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
    .setTimestamp();
  if (i == 0) logs.send(embed);

  db.set(`mutetime_${message.guild.id}_${user.id}`, {
    time: time,
    date: Date.now(),
    channel: message.channel.id
  });
  Timeout.set(
    "mute_" + message.guild.id + "_" + user.id,
    () => {
      member.roles
        .remove(muted)
        .then(() => {
          db.delete(`mutetime_${message.guild.id}_${user.id}`);

 let MuteExpired = new Discord.MessageEmbed() 
        .setDescription(`<:NewCheck:727103854478622813> Istekao je privremeni mute korisnika\n<:member:730777927389806695> Korisničko ime: ${user.tag}`)
          .setColor("02FDFD")

          message.channel.send(MuteExpired);
          if (i == 0) {
            let timeoutEmbed = new Discord.MessageEmbed()
                .setDescription(`<:NewCheck:727103854478622813> Istekao je privremeni mute korisnika\n<:member:730777927389806695> Korisničko ime: ${user.tag}`)
              .setThumbnail(user.displayAvatarURL())
              .setFooter(
                client.config.embed.footer,
                client.user.displayAvatarURL()
              )
              .setTimestamp();
            logs.send(timeoutEmbed);
          }
        })
        .catch(err => {
          console.log(err);
          if (i == 0) {
            let errorEmbed = new Discord.MessageEmbed()
              .setTitle(`<:NewCheck:727103854478622813> Istekao je privremeni mute člana` + user.tag + ", ali se pojavio error!")
              .addField("Error", err)
              .setThumbnail(user.displayAvatarURL())
              .setFooter(
                client.config.embed.footer,
                client.user.displayAvatarURL()
              )
              .setTimestamp();
            logs.send(errorEmbed);
          }
        });
    },
    time
  );

 let MuteSuccess1 = new Discord.MessageEmbed() 
    .setTitle("<:config:730778076472016927>  Uspešno si mutirao/la korisnika")
         .setDescription(`<:member:730777927389806695> ${user.tag} je mutiran od strane **${message.author.tag}** \n<:alert:730778124819628084> Razlog: ${razlog}\n<:links:730777902810923058> Vreme: ${vrijeme}`)
          .setColor("02FDFD") 

  member.roles
    .add(muted)
    .then(() =>
      message.channel.send(MuteSuccess1
      )
    )
     user.send({embed:{description:`<a:Upozorenje:720083883550441542> Dobili ste mute na __*Elusive™ Community*__\n\n<:member:730777927389806695> *Osoblje*: __${message.author.tag}__\n<:links:730777902810923058> *Vreme*: __${vrijeme}__\n<:alert:730778124819628084> *Razlog*: __${razlog}__\n\n__***Sledeći put poštujte pravila***__!`, color: 0x36393f}})

    .catch(err =>
      message.author.send("<alert730778124819628084> Nisam mogao mutirati tog člana zbog: " + err)
    );
};
exports.conf = {
  allowed: ["649708455342505984"]
};
exports.help = {
  name: "tempmute",
  description: "privremeno mutiranje članova",
  usage: "tempmute [@mention] [vrijeme] [razlog]",
  category: "moderation",
  listed: true
};
