"use strict";

const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init DB
require("./dbs/mongoose");
//init routers
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "hello world".repeat(100000),
  });
});
//handling error

module.exports = app;
