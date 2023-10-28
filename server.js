"use strict";
//start network
const app = require("./src/app");

const server = app.listen(3000, () => {
  console.log("hello world");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("exit server express");
  });

  //notify.send
});
module.exports = server;
