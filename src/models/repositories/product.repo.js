"use strict";

const { convertStringToObjectId, getUnSelectData } = require("../../utils");
const { productModel } = require("../product.model");

const findAllDraftForShopRepo = async ({ product_shop, limit, skip }) => {
  return await queryProduct({
    query: { product_shop, isDraft: true },
    limit,
    skip,
  });
};
const findAllPublishForShopRepo = async ({ product_shop, limit, skip }) => {
  return await queryProduct({
    query: { product_shop, isPublished: true },
    limit,
    skip,
  });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .limit(limit)
    .sort({ updateAt: -1 }) //latest
    .skip(skip)
    .lean()
    .exec();
};
const publishProductByShopRepo = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    product_shop,
    _id: convertStringToObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  console.log(foundProduct);
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};
const unpublishProductByShopRepo = async ({ product_shop, product_id }) => {
  const foundProduct = await productModel.findOne({
    product_shop,
    _id: convertStringToObjectId(product_id),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const searchProductByUserRepo = async (keySearch) => {
  const regexSearch = new RegExp(keySearch);
  return await productModel
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: 1 });
};

const findAllProductsRepo = async ({ limit, page, sort, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
  const products = productModel
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(select)
    .lean();

  return products;
};
const findProductRepo = async ({ product_id, unSelect }) => {
  return await productModel.findById(product_id).select(getUnSelectData(unSelect)).lean();
};
module.exports = {
  findAllDraftForShopRepo,
  publishProductByShopRepo,
  unpublishProductByShopRepo,
  findAllPublishForShopRepo,
  searchProductByUserRepo,
  findAllProductsRepo,
  findProductRepo,
};
