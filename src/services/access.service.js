"use strict";

const { ROLES } = require("../constants/shop.constants");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getDataInformation } = require("../utils");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //check email is exist or not
      const holderShop = await shopModel.findOne({ email }).lean(); //lean return object JS
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop is existed",
          status: "error",
        };
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        //save publicKey into DB
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: shop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          };
        }

        //publicKey string must be transfer to publicKey object rsa
        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        //create Access token and Refresh token
        const token = createTokenPair(
          { userId: shop._id, email },
          publicKeyObject,
          privateKey
        );
        if (!token) {
          return {
            code: "200",
            status: "token error",
          };
        }
        return {
          code: "201",
          metadata: {
            shop: getDataInformation(["email", "name", "_id"], shop),
            token,
          },
        };
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
