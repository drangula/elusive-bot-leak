// ping.js skripta

// svakih 5 minuta pinga glitch

const ping = require("./ping.js");

ping.on();

// Load up the discord.js library

const Discord = require("discord.js");

const Enmap = require("enmap");

const fs = require("fs");

// This is your client. Some people call it `bot`, some people call it `self`,

// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,

// this is what we're refering to. Your client.

const client = new Discord.Client();

client.Discord = Discord;

// Here we load the config.json file that contains our token and our prefix values.

const config = require("./config.json");

client.config = config;

// config.token contains the bot's token

// config.prefix contains the message prefix.

const server = require("./serverconfig.json");

client.server = server;

const dev_ids = ["495897264108339200"];

client.dev_ids = dev_ids;

const cooldown = new Set();

client.cooldown = cooldown;

const AntiSpam = require("discord-anti-spam");

const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: "{@user}, prestani spamati!", // Message that will be sent in chat upon warning a user.
  kickMessage: "**{user_tag}** je kikovan zbog spama!", // Message that will be sent in chat upon kicking a user.
  banMessage: "**{user_tag}** je banovan zbog spama!", // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
  exemptPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredUsers: [] // Array of User IDs that get ignored. // And many more options... See the documentation.
});

client.antiSpam = antiSpam;

client.invites = {};

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    // If the file is not a JS file, ignore it (thanks, Apple)
    if (!file.endsWith(".js")) return;
    // Load the event file itself
    const event = require(`./events/${file}`);
    // Get just the event name from the file name
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    // without going into too many details, this means each event will be called with the client argument,
    // followed by its "normal" arguments, like message, member, etc etc.
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Pokušavam pokrenuti komandu ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});

client.codes = new Enmap();
fs.readdir("./codes/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./codes/${file}`);
    let codeName = file.split(".")[0];
    console.log(`Pokušavam učitati kod ${codeName}`);
    client.codes.set(codeName, props);
  });
});

client.login("NzMxMjE4MDE2NDMxMzc0NDI3.Xwi1-w.f6FZenh8iaKngRByDZNHeEcFxoU");
