"use strict";
//start network
const app = require("./src/app");
const {
  app: { port },
} = require("./src/config/config.mongodb");
const server = app.listen(port || 3000, () => {
  console.log("hello world");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("exit server express");
  });

  //notify.send
});
module.exports = server;
