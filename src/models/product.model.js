"use strict";

const { Schema, model } = require("mongoose");
const {
  COLLECTION_PRODUCT,
  DOCUMENT_SHOP,
  DOCUMENT_PRODUCT,
  COLLECTION_CLOTHING,
  DOCUMENT_ELECTRONIC,
  DOCUMENT_CLOTHING,
  COLLECTION_ELECTRONIC,
} = require("../constants/model.constant");

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_description: String,
    product_thumb: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_SHOP,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["clothing", "electronic"],
    },
    product_attribute: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: COLLECTION_PRODUCT }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_SHOP,
    },
  },
  { timestamps: true, collection: COLLECTION_CLOTHING }
);

const electronicSchema = new Schema(
  {
    manufactory: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_SHOP,
    },
  },
  { timestamps: true, collection: COLLECTION_ELECTRONIC }
);
module.exports = {
  productModel: model(DOCUMENT_PRODUCT, productSchema),
  clothingModel: model(DOCUMENT_CLOTHING, clothingSchema),
  electronicModel: model(DOCUMENT_ELECTRONIC, electronicSchema),
};
