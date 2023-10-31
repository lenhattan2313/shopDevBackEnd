"use strict";

function asyncHandler(fn) {
  return async (req, res, next) => {
    return await fn(req, res, next);
  };
}

module.export = { asyncHandler };
