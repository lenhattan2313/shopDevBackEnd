"use strict";

const keyTokenModel = require("../models/keyToken.model");
const {
  Types: { ObjectId },
} = require("mongoose");
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
    const isExist = await keyTokenModel.findOne({
      userId,
      refreshTokensUsed: refreshTokenUsed,
    });
    return isExist;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ userId: new ObjectId(userId) });
  };

  static removeByUserId = async ({ userId }) => {
    return await keyTokenModel.deleteOne({ userId });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
}

module.exports = KeyTokenService;
