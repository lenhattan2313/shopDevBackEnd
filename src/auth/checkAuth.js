"use strict";

const apiKeyModel = require("../models/apiKey.model");
const { findByKey } = require("../services/apiKey.service");

const REQUEST_HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "access-token",
};
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
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = { apiKey, checkPermission, asyncHandler };
