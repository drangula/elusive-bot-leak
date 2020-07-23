const http = require("http");

const express = require("express");

const app = express();

module.exports.on = function() {
  app.get("/", (request, response) => {
    console.log(Date.now() + " - ping primljen!");

    response.sendStatus(200);
  });

  app.listen(process.env.PORT);

  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 280000);

  console.log("Ping.js skripta učitana!");
};
