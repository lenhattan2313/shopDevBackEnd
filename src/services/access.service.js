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
  AuthFailureError,
} = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");
const keyTokenModel = require("../models/keyToken.model");
const JWT = require("jsonwebtoken");
class AccessService {
  /*
    1. check mail
    2. check password
    3. check refreshToken be in used
    4. create AT and RT
    5. generate token
  */
  static login = async ({
    email,
    password,
    refreshToken: refreshTokenUsed = null,
  }) => {
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop doesn't exist");
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundShop.password
    );
    if (!isPasswordCorrect) throw new AuthFailureError("Authenticate error");
    const userId = foundShop._id;
    //check refresh token is used or not
    if (!refreshTokenUsed) {
      const isExistRefreshToken = await KeyTokenService.checkRefreshTokenInUsed(
        {
          userId,
          refreshTokenUsed,
        }
      );
      if (isExistRefreshToken && isExistRefreshToken.length > 0)
        throw new BadRequestError("Refresh token has already been used");
    }

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const token = createTokenPair({ userId, email }, publicKey, privateKey);
    if (!token) throw new BadRequestError("Token error");

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
      refreshTokenUsed,
    });
    return {
      shop: getDataInformation(["email", "name", "_id"], foundShop),
      token,
    };
  };

  //Logout
  static logout = async (keyToken) => {
    return await KeyTokenService.removeByUserId({ userId: keyToken.userId });
  };

  /*
    check refresh token is used?
  */
  static handleRenewToken = async ({ refreshToken, keyToken, user }) => {
    const { userId, email } = user;
    console.log("keyToken", keyToken);
    if (keyToken.refreshTokensUsed?.includes(refreshToken)) {
      console.log("found token is used ", user);
      await KeyTokenService.removeByUserId({ userId });
      throw new BadRequestError("Something is wrong, plz re-login");
    }
    if (keyToken.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop does not register");

    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop does not register");

    const newToken = await createTokenPair(
      { userId, email },
      keyToken.publicKey,
      keyToken.privateKey
    );

    await keyToken.updateOne({
      $set: { refreshToken: newToken.refreshToken },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return { user, token: newToken };
  };
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
        shop: getDataInformation(["email", "name", "_id"], shop),
        token,
      };
    }
  };
}

module.exports = AccessService;
