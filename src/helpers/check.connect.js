"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const _SECOND = 5000;
const checkConnect = () => {
  const numbConnect = mongoose.connections.length;
  return numbConnect;
};
const checkOverload = () => {
  setInterval(() => {
    const numbConnect = checkConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5; //example 5

    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numbConnect > maxConnections) {
      console.log(`Connection overload detects!`);
      //notify.send
    }
    //
  }, _SECOND);
};
module.exports = {
  checkConnect,
  checkOverload,
};
