const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if (message.channel.id !== "720037477146165399")
    return message.channel.send(
      "Ovu komandu možeš koristiti samo u kanalu <#720037477146165399>"
    );

  let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
  if (prefix === null) prefix = client.config.prefix;
  let komanda = args[0];
  if (!komanda) {
    let embed = new Discord.MessageEmbed()
      .setTitle(client.config.ime + " || " + "HELP")
      .setThumbnail(message.guild.iconURL())
      .addField("<a:magija:720083787001757726> Osnovne komande", "`" + prefix + "help main`")
      .addField("<:links:730777902810923058> Zabava", "`" + prefix + "help zabava`")
      .addField("<:config:730778076472016927> Moderatorske komande", "`" + prefix + "help mod`")
      .addField("<:member:730777927389806695> Administratorske komande", "`" + prefix + "help admin`")
      .addField(
        "<:novac:730778098680987739> Ekonomija",
        "`" + prefix + "help ekonomija\n" + prefix + "help ekonomija admin`"
      )
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed);
  } else if (komanda == "main") {
    let commands = client.commands.filter(
      c => c.help.category === "main" && c.help.listed === true
    );
    let loaded = commands.array();
    let content = "";

    loaded.forEach(
      c => (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
    );

    let embed = new Discord.MessageEmbed()
      .setTitle("<a:magija:720083787001757726> Osnovne komande")
      .setThumbnail(message.guild.iconURL())
      .setDescription(
        "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
          content
      )
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed);
  } else if (komanda == "zabava") {
    let commands = client.commands.filter(
      c => c.help.category === "fun" && c.help.listed === true
    );
    let loaded = commands.array();
    let content = "";

    loaded.forEach(
      c => (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
    );

    let embed = new Discord.MessageEmbed()
      .setTitle("<:links:730777902810923058> Zabava")
      .setThumbnail(message.guild.iconURL())
      .setDescription(
        "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
          content
      )
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL)
      .setTimestamp();

    message.channel.send(embed);
  } else if (komanda == "mod") {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.send("Nemaš permisiju za korištenje ove komande!");
    let commands = client.commands.filter(
      c => c.help.category === "moderation" && c.help.listed === true
    );
    let loaded = commands.array();
    let content = "";

    loaded.forEach(
      c => (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
    );

    let embed = new Discord.MessageEmbed()
      .setTitle("<:config:730778076472016927> Moderatorske komande")
      .setThumbnail(message.guild.iconURL())
      .setDescription(
        "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
          content
      )
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL)
      .setTimestamp();

    message.channel.send(embed);
  } else if (komanda == "admin") {
    if (!message.member.permissions.has("KICK_MEMBERS"))
      return message.channel.send("Nemaš permisiju za korištenje ove komande!");
    let commands = client.commands.filter(
      c => c.help.category === "admin" && c.help.listed === true
    );
    let loaded = commands.array();
    let content = "";

    loaded.forEach(
      c => (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
    );

    let embed = new Discord.MessageEmbed()
      .setTitle("<:member:730777927389806695> Administratorske komande")
      .setThumbnail(message.guild.iconURL())
      .setDescription(
        "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
          content
      )
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL)
      .setTimestamp();

    message.channel.send(embed);
  } else if (komanda == "ekonomija") {
    if (args[1] == "admin") {
      if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send(
          "Nemaš permisiju za korištenje ove komande!"
        );

      let commands = client.commands.filter(
        c => c.help.category === "economy-a" && c.help.listed === true
      );

      let loaded = commands.array();
      let content = "";

      loaded.forEach(
        c =>
          (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
      );

      let embed = new Discord.MessageEmbed()
        .setTitle("<:novac:730778098680987739> Ekonomija | ADMIN")
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
            content
        )
        .setColor("4CAAFF")
        .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
        .setTimestamp();

      message.channel.send(embed);
    } else {
      let commands = client.commands.filter(
        c => c.help.category === "economy" && c.help.listed === true
      );

      let loaded = commands.array();
      let content = "";

      loaded.forEach(
        c =>
          (content += `**${prefix}${c.help.usage}** - ${c.help.description}\n`)
      );

      let embed = new Discord.MessageEmbed()
        .setTitle("<:novac:730778098680987739> Ekonomija")
        .setThumbnail(message.guild.iconURL())
        .setDescription(
          "**NAPOMENA**: ukoliko je potreban unos dodatnih podataka, oni su označeni sa `[]` i `()` u listi komandi!\n\n" +
            content
        )
        .setColor("4CAAFF")
        .setFooter(client.config.embed.footer, client.user.displayAvatarURL)
        .setTimestamp();

      message.channel.send(embed);
    }
  } else {
    let cmd = client.commands.get(komanda);
    if (!cmd) return message.channel.send("Ta komanda ne postoji!");

    if (
      cmd.help.category === "moderation" &&
      !message.member.permissions.has("MANAGE_MESSAGES")
    )
      return message.channel.send("Nemaš permisiju za korištenje te komande!");
    if (
      cmd.help.category === "admin" &&
      !message.member.permissions.has("KICK_MEMBERS")
    )
      return message.channel.send("Nemaš permisiju za korištenje te komande!");
    if (
      cmd.help.category === "dev" &&
      message.author.id !== client.config.dev.id
    )
      return message.channel.send("Ta komanda ne postoji!");

    let listed = "NE";
    if (cmd.help.listed) listed = "DA";

    let embed = new Discord.MessageEmbed()
      .setTitle("🖥 | Informacije o komandi")
      .setThumbnail(message.guild.iconURL())
      .addField("Ime komande", "`" + cmd.help.name + "`")
      .addField("Opis komande", "`" + cmd.help.description.toUpperCase() + "`")
      .addField("Način korištenja", "`" + prefix + cmd.help.usage + "`")
      .addField("Kategorija", "`" + cmd.help.category.toUpperCase() + "`")
      .addField("Nalazi se na listi komandi", "`" + listed + "`")
      .setColor("4CAAFF")
      .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed);
  }
};
exports.help = {
  name: "help",
  description: "pomoć za komande",
  usage: "help [komanda ili kategorija komandi (neobavezno)]",
  category: "main",
  listed: false
};
