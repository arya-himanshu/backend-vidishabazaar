import express from "express";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";

const addShopProductController = (req, res, next) => {
  const { name, title, description, price, quantity_available, photos, is_product_in_stock } = req.body;

  if (!name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_NAME_REQUIRED, undefined, false));
  if (!price) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_PRICE_REQUIRED, undefined, false));
  if (!quantity_available) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_QUANTITY_REQUIRED, undefined, false));
  res.send(req.body);
};

export default addShopProductController;
