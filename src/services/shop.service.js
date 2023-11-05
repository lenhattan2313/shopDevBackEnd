"use strict";

const shopModel = require("../models/shop.model");

const findShopByEmail = async ({
  email,
  select = { password: 1, email: 1, roles: 1, status: 1, name: 1 },
}) => {
  const shop = await shopModel.findOne({ email }).select(select).lean();
  return shop;
};
module.exports = { findShopByEmail };
