const db = require("quick.db");

module.exports = async (client, guild) => {
  console.log(`Obrisan sam sa: ${guild.name} (id: ${guild.id})`);

  client.user.setActivity(
    `${client.config.ime} || v${client.config.verzija} || ʙᴇᴛᴀ`
  );

  let data = await db.all().filter(data => data.ID.includes(guild.id));
  data.forEach(d => db.delete(d.ID));
};
