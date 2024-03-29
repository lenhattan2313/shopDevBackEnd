"use strict";

require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const cors = require("cors");
const app = express();
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS with specific options
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your allowed origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204, // Respond with 204 (No Content) for preflight requests
  })
);
//init DB
require("./dbs/mongoose");
// checkOverload();
//init routers
app.use("/", require("./routers"));

//handling error
//2 type of error: error in router and error below router like: 404

//middleware
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    statusCode,
    stack: err.stack,
    message: err.message || "Internal server error",
  });
});
module.exports = app;
