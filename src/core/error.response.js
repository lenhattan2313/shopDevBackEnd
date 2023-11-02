"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};
const ReasonStatus = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict",
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatus.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatus.CONFLICT, status = StatusCode.CONFLICT) {
    super(message, status);
  }
}

module.exports = {
  BadRequestError,
  ConflictRequestError,
};
