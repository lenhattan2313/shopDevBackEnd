"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/product.model");

//create clothing first, product after

class Product {
  constructor({
    product_name,
    product_description,
    product_thumb,
    product_price,
    product_quantity,
    product_type,
    product_attribute,
    product_shop,
  }) {
    this.product_name = product_name;
    this.product_description = product_description;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attribute = product_attribute;
    this.product_shop = product_shop;
  }
  async createProduct(product_id) {
    const product = await productModel.create({ ...this, id: product_id });
    if (!product) throw new BadRequestError("Cannot create product");
    return product;
  }
}

class Clothing extends Product {
  async createProduct() {
    const clothing = await clothingModel.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!clothing) throw new BadRequestError("Cannot create clothing");

    const product = await super.createProduct(clothing._id);
    return product;
  }
}
class Electronic extends Product {
  async createProduct() {
    const electronic = await electronicModel.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!clothing) throw new BadRequestError("Cannot create electronic");

    const product = await super.createProduct(clothing._id);
    return product;
  }
}
//factory simple pattern
class ProductFactory {
  static createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
    }
  }
}

const configClass = {
  clothing: Clothing,
  electronic: Electronic,
};
//factory method pattern
class ProductFactoryMethod {
  static productRegister = {};

  static registerProductClass = (type, productClass) => {
    ProductFactoryMethod.productRegister[type] = productClass;
  };
  static createProduct(type, payload) {
    //subscribe class
    for (const [key, value] of Object.entries(configClass)) {
      ProductFactoryMethod.registerProductClass(key, value);
    }

    const product = ProductFactoryMethod.productRegister[type];
    if (!product) throw new BadRequestError("Cannot create product");
    return new product(payload).createProduct();
  }
}

module.exports = ProductFactoryMethod;
