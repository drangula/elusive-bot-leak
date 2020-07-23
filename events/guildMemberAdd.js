const Discord = require("discord.js");
const db = require("quick.db");
const guild = require("../supportguild.json");

module.exports = async (client, member) => {
  let pikachu = client.emojis.cache.get("<a:PikaPozdrav:720246672571105291>");
  if (member.guild.id === guild.id) {
    member.guild.channels.cache
      .get(guild.membercount)
      .setName("Member Count: " + member.guild.memberCount);
    member.roles.add("720037444749230190");
  }
  let i = 0;
  let msglogs = await db.fetch(`logs_${member.guild.id}_msglogs`);
  if (msglogs === null) i++;
  if (i == 0) msglogs = client.channels.cache.get(msglogs);
  if (msglogs === undefined || msglogs === null) i++;
  if (member.guild.id === client.server.guild) {
    member.send(client.server.welcomemsg).catch(err => {
      if (i == 0) {
        let msgEmbed = new Discord.MessageEmbed()
          .setAuthor(
            "Novi član se pridružio serveru!",
            member.user.displayAvatarURL()
          )
          .setDescription(
            pikachu.toString() +
              " | Novi član **(" +
              member.toString() +
              ")** se upravo pridružio serveru, ali mu nisam mogao poslati privatnu poruku!\nVjerovatno je tom korisniku zaključan DM!"
          )
          .setFooter(client.config.embed.footer, client.user.displayAvatarURL())
          .setTimestamp();
        msglogs.send(msgEmbed);
      }
    });
    client.channels.cache
      .get("720037475401072691")
      .send({
        embed: {
          title: ` **Novi član ${member.user.tag}`,
          description: `<:member:730777927389806695> Novi clan se pridruzio/la serveru. \n\n <:Notify:727103824430366740>Dobrodošao/la na naš server, obavezno čekiraj svoje unikatne rolove!`,
          color: 0x36393f
        }
      })
      .then(msg => msg.react("member:730777927389806695"));
  }
  let logs = await db.fetch(`logs_${member.guild.id}_memberlogs`);
  if (logs === null) return;
  logs = client.channels.cache.get(logs);
  if (logs === undefined || logs === null) return;
  let embed = new client.Discord.MessageEmbed()
    .setColor("#4CAAFF")
    .setAuthor(
      "Novi član se upravo pridružio serveru!",
      member.user.displayAvatarURL()
    )
    .setDescription(
      `:wave:` +
        " | **" +
        member.toString() +
        "**, dobrodošao/la na\n**" +
        member.guild.name +
        "**"
    )
    .setImage(member.guild.iconURL({ dynamic: true, size: 512 }))
    .setFooter("Elusive", client.user.displayAvatarURL())
    .setTimestamp();
  logs.send(embed);
};
