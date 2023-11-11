"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const router = express.Router();
router.get("/:keySearch", asyncHandler(productController.searchProductByUser));
//authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishProductForShop)
);
router.get(
  "/draft/all",
  asyncHandler(productController.getAllDraftProductForShop)
);

module.exports = router;
