import express from "express";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import ShoProductpModel from "../models/shopProduct.js";
const addShopProductController = async (req, res, next) => {
  const { product_name, product_description, price, photos, quantity, shop_id } = req.body;

  if (!product_name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_NAME_REQUIRED, undefined, false));
  if (!shop_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ID_REQUIRED, undefined, false));
  if (!price) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_PRICE_REQUIRED, undefined, false));
  if (!quantity) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_QUANTITY_REQUIRED, undefined, false));
  try {
    const product = await ShoProductpModel({ product_name, product_description, price, photos, quantity, shop_id, last_updated: new Date(), created_at: new Date() });
    if (product) {
      const registeredProduct = await product.save();
      if (registeredProduct) {
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_CREATED_SUCCESSFULY, registeredProduct, true));
      } else {
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    }
  } catch (er) {
    console.log(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getProductsWithShopId = async (shop_id) => {
  if (!shop_id) {
    return Promise.reject("Shop Id is required");
  }
  try {
    const shopProducts = await ShoProductpModel.find({ shop_id });
    if (shopProducts && shopProducts.length) {
      return shopProducts;
    } else {
      return [];
    }
  } catch (e) {
    return "No data found for given id.";
  }
};

export { addShopProductController, getProductsWithShopId };
