import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import ShoProductpModel from "../models/shopProduct.js";
import { getHeaders } from "../middleware/auth.js";
import { getShopWithUserId } from "./shopCRUDController.js";

const addShopProductController = async (req, res, next) => {
  const { name, description, price, images, quantity, shop_id, unit } = req.body;
  if (!name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_NAME_REQUIRED, undefined, false));
  if (!shop_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ID_REQUIRED, undefined, false));
  if (!price) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_PRICE_REQUIRED, undefined, false));
  if (!quantity) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PRODUCT_QUANTITY_REQUIRED, undefined, false));
  try {
    const { loginuserid } = getHeaders(req);
    const isRightAccess = await validatingUserCanReadWriteProduct(loginuserid, shop_id);
    if (isRightAccess) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
    }
    const product = await ShoProductpModel({ name, description, price, images, quantity, shop_id, last_updated: new Date(), created_at: new Date(), unit });
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
  const { name, description, price, quantity, unit, images } = req.body;
  try {
    const { loginuserid } = getHeaders(req);
    const isRightAccess = await validatingUserCanReadWriteProduct(loginuserid, req.body._id);
    if (isRightAccess) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
    }
    const updatedProduct = await ShoProductpModel.update({ _id: req.body._id }, { $set: { name, description, price, quantity, images, last_updated: new Date(), unit } });
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
  try {
    const { loginuserid } = getHeaders(req);
    const { id } = req.params;
    const isRightAccess = await validatingUserCanReadWriteProduct(loginuserid, id);
    if (isRightAccess) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
    }
    const deletedProduct = await ShoProductpModel.deleteOne({ _id: id });
    if (!deletedProduct) {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.DELETE_SHOP_SUCCESS, undefined, true));
    }
  } catch (er) {
    console.error(err);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};
const getProductById = async (productId) => {
  try {
    return await ShoProductpModel.findOne({ _id: productId });
  } catch (err) {
    console.error(err);
  }
};
const validatingUserCanReadWriteProduct = async (userId, productId) => {
  const product = await getProductById(productId);
  if (product) {
    const shop = await getShopWithUserId(product.shop_id);
    if (shop && shop.owner_user_id !== userId) {
      return true;
    } else {
      return false;
    }
  }
};
export { addShopProductController, getProductsWithShopId, updateProduct, deleteProductById };
