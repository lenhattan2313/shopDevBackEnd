"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    const publicKeyString = publicKey.toString();
    const token = await keyTokenModel.create({
      userId,
      publicKey: publicKeyString,
    });
    return token ? token.publicKey : null;
  };
}

module.exports = KeyTokenService;
