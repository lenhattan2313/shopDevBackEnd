"use strict";
const slugify = require("slugify");
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
    product_name: { type: String, required: true }, //new shirt in this year
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
    product_slug: String, //new-shirt-in-this-year,
    product_rateAverage: {
      type: Number,
      default: 4.5,
      set: (value) => Math.round(value * 10) / 10,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false }, //don't need to put prefix product_
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  { timestamps: true, collection: COLLECTION_PRODUCT }
);

//create index
productSchema.index({ product_name: "text", product_description: "text" });
//document middleware
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
