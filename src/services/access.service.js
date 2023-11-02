"use strict";

const { ROLES } = require("../constants/shop.constants");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getDataInformation } = require("../utils");
const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    //check email is exist or not
    const holderShop = await shopModel.findOne({ email }).lean(); //lean return object JS
    if (holderShop) {
      throw new ConflictRequestError("Shop is existed");
    }

    //create shop

    const passwordHash = await bcrypt.hash(password, 10);
    const shop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLES.SHOP],
    });
    if (shop) {
      //create key pair with RSA
      // privateKey don't store in DB
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      //save publicKey into DB
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: shop._id,
        publicKey,
        privateKey,
      });
      if (!publicKeyString) {
        throw new BadRequestError("publicKeyString error");
      }

      //publicKey string must be transfer to publicKey object rsa
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      //create Access token and Refresh token
      const token = createTokenPair(
        { userId: shop._id, email },
        publicKey,
        privateKey
      );
      if (!token) {
        throw new BadRequestError("token error");
      }
      return {
        code: "201",
        metadata: {
          shop: getDataInformation(["email", "name", "_id"], shop),
          token,
        },
      };
    }
  };
}

module.exports = AccessService;
