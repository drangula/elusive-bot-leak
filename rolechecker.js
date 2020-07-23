module.exports.isModerator = role => {
  if (!role) throw "Uloga nije označena!";
  else if (
    !role.toString().includes("<") ||
    !role.toString().includes("@") ||
    !role.toString().includes(">")
  )
    throw "Nije unesena ispravna uloga!";
  else if (
    role.permissions.any(
      "MANAGE_MESSAGES",
      "MANAGE_ROLES",
      "MANAGE_CHANNELS",
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "MANAGE_GUILD",
      "ADMINISTRATOR"
    )
  )
    return true;
  else if (
    !role.permissions.has(
      "MANAGE_MESSAGES",
      "MANAGE_ROLES",
      "MANAGE_CHANNELS",
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "MANAGE_GUILD",
      "ADMINISTRATOR"
    )
  )
    return false;
  else throw "Ne može se izvršiti skripta!";
};
