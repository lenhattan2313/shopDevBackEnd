"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = null,
    refreshTokenUsed = null,
  }) => {
    //level: 0
    // const token = await keyTokenModel.create({
    //   userId,
    //   publicKey,
    //   privateKey,
    // });
    // return token ? token.publicKey : null;

    //level xxx
    //check refreshToken
    const filters = { userId },
      update = {
        publicKey,
        privateKey,
        $push: { refreshTokensUsed: refreshTokenUsed }, // Use $push to add to the array
        refreshToken,
      },
      options = { upsert: true, new: true };
    const token = await keyTokenModel.findOneAndUpdate(
      filters,
      update,
      options
    );
    return token ? token.publicKey : null;
  };
  static checkRefreshTokenInUsed = async ({ userId, refreshTokenUsed }) => {
    const isExist = await keyTokenModel.find({
      userId,
      refreshTokensUsed: refreshTokenUsed,
    });
    return isExist;
  };
}

module.exports = KeyTokenService;
