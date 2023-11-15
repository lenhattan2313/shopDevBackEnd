"use strict";

const {
  SuccessResponse,
  SuccessRequest,
  CREATED,
  OK,
} = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(`[P]::createProduct::`, req.body);
    return new OK({
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  publishProductByShop = async (req, res, next) => {
    console.log(`[P]::publishProductByShop::`, req.body);
    return new OK({
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unpublishProductByShop = async (req, res, next) => {
    console.log(`[P]::unpublishProductByShop::`, req.body);
    return new OK({
      metadata: await ProductService.unpublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //start query *******
  getAllDraftProductForShop = async (req, res, next) => {
    console.log(`[P]::getAllDraftProductForShop::`, req.body);
    return new OK({
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
        limit: req.body?.limit,
        skip: req.body?.skip,
      }),
    }).send(res);
  };

  getAllPublishProductForShop = async (req, res, next) => {
    console.log(`[P]::getAllPublishProductForShop::`, req.body);
    return new OK({
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
        limit: req.body?.limit,
        skip: req.body?.skip,
      }),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    console.log(`[P]::getAllProducts::`, req.body);
    return new OK({
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    console.log(`[P]::getProduct::`, req.body);
    return new OK({
      metadata: await ProductService.findProduct(req.params.id),
    }).send(res);
  };
  //end query ********

  searchProductByUser = async (req, res, next) => {
    console.log(`[P]::searchProductByUser::`, req.body);
    return new OK({
      metadata: await ProductService.searchProductByUser(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
