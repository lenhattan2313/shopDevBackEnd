"use strict";

const { default: mongoose } = require("mongoose");

const checkConnect = () => {
  const numbConnect = mongoose.connections.length;
  return numbConnect;
};
module.exports = {
  checkConnect,
};
