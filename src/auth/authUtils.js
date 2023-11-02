"use strict";
const JWT = require("jsonwebtoken");
const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, result) => {
      if (err) {
        console.log(`Cannot verify token:: `, error);
      } else {
        console.log(`Decode token verify::`, result);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`createTokenPair error: ${error}`);
  }
};
module.exports = { createTokenPair };
