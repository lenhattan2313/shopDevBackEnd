"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const router = express.Router();

//authentication
router.use(authentication);

router.post("/shop/product", asyncHandler(productController.createProduct));

module.exports = router;
