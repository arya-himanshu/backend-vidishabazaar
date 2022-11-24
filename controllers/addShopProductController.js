import express from "express";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import ShoProductpModel from "../models/shopProduct.js";
const addShopProductController = async (req, res, next) => {
  const { product_name, product_description, price, photos, quantity, shop_id, unit } = req.body;
  if (!product_name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_NAME_REQUIRED, undefined, false));
  if (!shop_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ID_REQUIRED, undefined, false));
  if (!price) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_PRICE_REQUIRED, undefined, false));
  if (!quantity) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_QUANTITY_REQUIRED, undefined, false));
  try {
    const product = await ShoProductpModel({ product_name, product_description, price, photos, quantity, shop_id, last_updated: new Date(), created_at: new Date(), unit });
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
    console.error(er);
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

const updateProduct = async (req, res, next) => {
  const { product_name, product_description, price, quantity, unit } = req.body;
  try {
    const updatedProduct = await ShoProductpModel.update({ _id: req.body._id }, { $set: { product_name, product_description, price, quantity, last_updated: new Date(), unit } });
    if (updatedProduct) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, updatedProduct, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const deleteProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProduct = await ShoProductpModel.deleteOne({ _id: id });
    if (!deletedProduct) {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.DELETE_SHOP_SUCCESS, undefined, true));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

export { addShopProductController, getProductsWithShopId, updateProduct, deleteProductById };
