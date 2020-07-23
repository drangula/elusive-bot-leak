const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord");
// let songs = readFileSync('songs.txt', 'utf-8').split('\n').filter(r => r !== '')

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR")) return;
  if (!message.member.permissions.has("ADMINISTRATOR")) return;

  let member = message.guild.members.cache.get(client.user.id);
  if (member.voice.channel) member.voice.channel.leave();
  if (!message.member.voice.channel && member.voice.channel)
    return member.voice.channel.leave();
  if (!message.member.voice.channel) return;

  const play = async (conn, i = 0) => {
    //if(!songs[i]) i = 0
    // const dispatcher = await conn.play(await ytdl(songs[i]), { type: 'opus' })
    const dispatcher = await conn.play("http://live6.okradio.net:8054/", {
      filter: "audioonly"
    });
    dispatcher.on("finish", () => {
      console.log("a");
      //play(conn, i+1)
    });
  };

  let conn = await message.member.voice.channel.join();
  play(conn);
};
exports.help = {
  name: "play",
  description: "pustanje radija",
  usage: "play [#kanal]",
  category: "admin",
  listed: true
};
