"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");
const getDataInformation = (fields = [], object = {}) => {
  return _.pick(object, fields);
};
const convertStringToObjectId = (value) => {
  return new Types.ObjectId(value);
};
const getUnSelectData = (unSelect) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};
const removeNullUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};
/*
  {
    a {
    b: 1,
    c: {
      d: 1,
      e: 1
      }
    }
  }
  => {a.b: 1, a.c.d: 1, a.c.e: 1}
*/
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response).forEach((keyNested) => {
        final[`${key}.${keyNested}`] = response[keyNested];
      });
    } else if (obj[key] !== null && obj[key] !== undefined) {
      final[key] = obj[key];
    }
  });
  return final;
};
module.exports = {
  getDataInformation,
  convertStringToObjectId,
  getUnSelectData,
  removeNullUndefinedObject,
  updateNestedObjectParser,
};
