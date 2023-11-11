"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");
const getDataInformation = (fields = [], object = {}) => {
  return _.pick(object, fields);
};
const convertStringToObjectId = (value) => {
  return new Types.ObjectId(value);
};
module.exports = {
  getDataInformation,
  convertStringToObjectId,
};
