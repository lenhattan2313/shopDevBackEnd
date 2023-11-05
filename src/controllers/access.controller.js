"use strict";

const {
  SuccessResponse,
  SuccessRequest,
  CREATED,
  OK,
} = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signup::`, req.body);
    return new CREATED({
      metadata: await AccessService.signUp(req.body),
      options: { limit: 10 },
    }).send(res);
  };
  login = async (req, res, next) => {
    console.log(`[P]::login::`, req.body);
    return new OK({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
