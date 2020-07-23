const Discord = require("discord.js");
const words = require("../rijeci.js");
const db = require("quick.db");

module.exports = async (client, message) => {
  client.antiSpam.message(message);
  if (message.channel.type === "dm") return;
  let status = await db.fetch(`code_${message.guild.id}_status`);
  let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
  if (prefix === null) prefix = client.config.prefix;
  // Ignore all bots
  if (
    message.guild.id === "678376543440994374" &&
    message.author.id === "701151973185159168" &&
    message.channel.id !== "683287368039530509" &&
    message.embeds
  ) {
    let author = false;
    message.embeds.forEach(embed => {
      if (embed.author && embed.author.name.toString().startsWith("Čestitam,"))
        author = embed.author.name;
    });
    if (!author) return;
    let usertag = author.replace("Čestitam, ", "").split(", prešao/la")[0];
    let user = client.users.cache.find(u => u.tag === usertag);
    let member = message.guild.members.cache.get(user.id);
    db.add(`money_${message.guild.id}_${user.id}`, 500);
  }
  if (message.author.bot) return;
  /* if(words.zabranjeno.some(word => message.content.toLowerCase().includes(word)) && !message.member.permissions.has("KICK_MEMBERS") && message.guild.id !== "696843134596022282") {
     let razlog = "Zabranjena riječ!"; */
  if (
    words.link.some(word => message.content.toLowerCase().includes(word)) &&
    !message.member.permissions.has("KICK_MEMBERS") &&
    message.channel.id !== "697009720934006794"
  ) {
    let razlog = "Vanjski link/Discord pozivnica!";
    db.add(`warns_${message.guild.id}_${message.author.id}`, 1);
    let forbiddenEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setAuthor(
        message.author.username + " je dobio/la warn!",
        message.author.displayAvatarURL()
      )
      .setDescription("**Razlog:** " + razlog);
    message
      .delete()
      .then(() => message.channel.send(forbiddenEmbed))
      .catch(err => console.log(err));
  }
  /* if(message.mentions.has("649708455342505984") && !message.mentions.has(message.guild.id) && message.author.id !== client.config.dev.id) {
    message.delete();
    message.channel.send("APOLLO ne prima tagove, ukoliko vam je potreban javite mu se dm!")
    .then(msg => msg.delete({ timeout: 3000 }));
  } */
  if (
    message.mentions.has(client.user) &&
    !message.mentions.has(message.guild.id) &&
    message.content.indexOf(prefix) !== 0
  ) {
    if (
      message.author.id === client.config.dev.id ||
      message.author.id === "649708455342505984" ||
      message.author.id === "447324949061828608"
    ) {
      let i = 0;
      let args = message.content
        .slice(message.mentions.toString().length + 6)
        .trim()
        .split(/ +/g);
      let codeName = args.shift();
      let code = client.codes.get(codeName);
      if (!code) i++;
      if (i == 0) {
        code.load(client, message, args);
        return;
      }
    }
    message.delete();
    message.channel
      .send("Listu komandi i ostalo možeš naći na `" + prefix + "help`")
      .then(msg => msg.delete({ timeout: 5000 }));
    return;
  }
  if (
    message.mentions.has(client.user) &&
    message.author.id === client.config.dev.id &&
    message.content.toLowerCase().includes("prefix")
  )
    db.delete(`settings_${message.guild.id}_prefix`);

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(prefix) !== 0) return;
  // Our standard argument/command name definition.
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);
  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;
  if (
    status !== null &&
    (status.code == 2 || status.code == 3) &&
    cmd.help.category !== "moderation" &&
    cmd.help.category !== "admin" &&
    cmd.help.category !== "dev"
  )
    return;
  if (message.guild.id === "678376543440994374") {
    if (cmd.help.category === "economy" || cmd.help.category === "economy-a") {
      let channel = message.guild.channels.cache.get("713540999284260926");
      if (channel) {
        let logsEmbed = new Discord.MessageEmbed()
          .setTitle("Economy Logging")
          .setColor("BLUE")
          .addField("Komanda", "`" + message.cleanContent + "`")
          .addField("Vrsta", "`" + cmd.help.category.toUpperCase() + "`")
          .addField("Autor", "`" + message.author.tag + "`")
          .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
          .setTimestamp();

        channel.send(logsEmbed);
      }
    }
    if (
      message.channel.id !== "720037477146165399" &&
      cmd.help.category !== "dev" &&
      cmd.help.category !== "admin" &&
      cmd.help.category !== "moderation" &&
      cmd.help.category !== "economy-a" &&
      cmd.help.name !== "daily" &&
      cmd.help.name !== "weekly" &&
      cmd.help.name !== "work" &&
      cmd.help.name !== "slots"
    ) {
      if (
        cmd.help.category === "economy" &&
        message.channel.id === "720037477146165399"
      )
        return message.channel.send("Komande su isključene u ovom kanalu!");
      else if (cmd.help.category !== "economy") {
        let channel = message.guild.channels.cache.get("720037477146165399");
        message.channel.send(
          "Komande su isključene u ovom kanalu **(--> " +
            channel.toString() +
            ")**"
        );
        return;
      }
    }
  }
  // Run the command
  cmd.run(client, message, args);
};
