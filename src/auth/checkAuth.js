"use strict";

const JWT = require("jsonwebtoken");
const { REQUEST_HEADER } = require("../constants/common.constants");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const apiKeyModel = require("../models/apiKey.model");
const { findByKey } = require("../services/apiKey.service");
const KeyTokenService = require("../services/keyToken.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[REQUEST_HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    //check key
    const objKey = await findByKey(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(`apiKey::`, error);
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const { permissions } = req.objKey;

    console.log(`Permission::`, permissions);
    if (!permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    const isValid = permissions.includes(permission);
    if (!isValid) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};
/*
  1. check and verify userId
  2. check and verify accessToken
  */
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[REQUEST_HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid userId");

  const token = await KeyTokenService.findByUserId(userId);
  if (!token) throw new AuthFailureError("UserID is not exist");

  const accessToken = req.headers[REQUEST_HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid token");

  try {
    const decodeAT = JWT.verify(accessToken, token.publicKey);
    const userToken = decodeAT.userId;
    if (userId !== userToken)
      throw new NotFoundError("Access token is invalid");
    req.keyToken = token;
    next();
  } catch (error) {
    throw error;
  }
});
module.exports = { apiKey, checkPermission, authentication };
