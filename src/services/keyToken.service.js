"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    const token = await keyTokenModel.create({
      userId,
      publicKey,
      privateKey,
    });
    return token ? token.publicKey : null;
  };
}

module.exports = KeyTokenService;
