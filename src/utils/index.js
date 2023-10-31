"use strict";
const _ = require("lodash");
const getDataInformation = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

module.exports = {
  getDataInformation,
};
