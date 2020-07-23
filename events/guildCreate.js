module.exports = client => {
  console.log(
    `Novi server se pridruzio: ${client.guild.name} (id: ${client.guild.id}). Ovaj server ima ${client.guild.memberCount} clan/a/ova!`
  );

  client.user.setActivity(
    `${client.config.ime} || v${client.config.verzija} || ʙᴇᴛᴀ`
  );
};
