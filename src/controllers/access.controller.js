"use strict";

const {
  SuccessResponse,
  SuccessRequest,
  CREATED,
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
}

module.exports = new AccessController();
