"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("crypto");
const findByKey = async (key) => {
  //get API key from AWS or Admin but for now will create by yourself
  // const newKey = crypto.randomBytes(64).toString("hex");
  // const objectNewKey = await apiKeyModel.create({
  //   key: newKey,
  //   permissions: ["0000"],
  // });
  const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

module.exports = { findByKey };
