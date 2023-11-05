"use strict";

const { StatusCodes, ReasonPhrases } = require("./httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatus = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message || reasonStatus;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.reasonStatus = reasonStatus;
  }
  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}
class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = StatusCodes.CREATED,
    reasonStatus = ReasonPhrases.CREATED,
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatus });
    this.options = options;
  }
}
module.exports = { SuccessResponse, OK, CREATED };
