"use strict";
const StatusCode = {
  OK: 200,
  CREATED: 201,
};
const ReasonStatus = {
  OK: "Success",
  CREATED: "Created",
};
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatus = ReasonStatus.OK,
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
    statusCode = StatusCode.CREATED,
    reasonStatus = ReasonStatus.CREATED,
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatus });
    this.options = options;
  }
}
module.exports = { SuccessResponse, OK, CREATED };
