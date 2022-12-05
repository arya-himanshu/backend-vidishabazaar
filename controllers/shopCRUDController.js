import { ShopModel } from "../models/shopRegistrationModel.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import { getProductsWithShopId } from "./addShopProductController.js";
import GenericShopModel from "../services/GenericShopModel.js";
import { getHeaders } from "../middleware/auth.js";

const creatingShop = async (req, res, next) => {
  const { shop_name, shop_gst_number, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_image, is_shop_Physically_available, shop_id, description, shop_tags, opening_time, closing_time, days, shopSearchString } = req.body;
  if (!shop_name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_NAME_REQUIRED, undefined, false));
  if (!shop_owner_user_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_OWNER_ID_REQUIRED, undefined, false));
  if (!shop_mobile) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_MOBILE_REQUIRED, undefined, false));
  if (!shop_category_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_CATEGORY_ID_REQUIRED, undefined, false));
  if (!shop_address) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ADDRESS_REQUIRED, undefined, false));
  try {
    const shop = await ShopModel({ shop_name, shop_gst_number: shop_gst_number, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_image, is_shop_Physically_available, last_updated: new Date(), created_at: new Date(), is_shop_varified: false, is_shop_active: false, is_shop_Physically_available: true, shop_id, description, shop_tags: shop_tags, opening_time, closing_time, days, shopSearchString, otp: Math.floor(100000 + Math.random() * 900000) });
    if (shop) {
      const registeredShop = await shop.save();
      if (registeredShop) {
        await VidishaBazaarUser.update({ _id: shop_owner_user_id }, { $set: { userRole: "ADMIN" } });
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_CREATED_SUCCESSFULY, registeredShop, true));
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

const getAllShops = async (req, res, next) => {
  try {
    const searchString = req.query.searchString;
    const subCategoryId = req.query.subCategoryId;
    const pageNumber = req.query.pageNumber;
    const nPerPage = req && req.query.nPerPage && req.query.nPerPage ? req.query.nPerPage : 10;
    let shopsCount = await ShopModel.count();
    let shops;
    if (subCategoryId && searchString) {
      shops = shops = await ShopModel.find({ shop_category_id: subCategoryId, $text: { $search: searchString } })
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({ shop_category_id: subCategoryId, $text: { $search: searchString } });
    } else if (subCategoryId) {
      shops = shops = await ShopModel.find({ shop_category_id: subCategoryId })
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({ shop_category_id: subCategoryId });
    } else if (searchString) {
      shops = await ShopModel.find({ $text: { $search: `${searchString ? searchString : ""} ${subCategoryId ? subCategoryId : ""}` } })
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({ $text: { $search: `${searchString ? searchString : ""} ${subCategoryId ? subCategoryId : ""}` } });
    } else {
      shops = await ShopModel.find({})
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
    }
    if (shops && shops.length) {
      return next(ApiGenericResponse.successServerCode("Success", { shops, itemsCount: shopsCount }, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND, { shops: [], itemsCount: 0 }, true));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getShopsWithName = async (req, res, next) => {
  try {
    const shops = await ShopModel.find({ shop_name: { $regex: req.query.searchString, $options: "i" } });
    if (shops) {
      return next(ApiGenericResponse.successServerCode("Success", shops, true));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getShopWithId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await ShopModel.findOne({ _id: id });
    if (shop) {
      getProductsWithShopId(id)
        .then((shopProducts) => {
          return next(ApiGenericResponse.successServerCode("Success", new GenericShopModel(shop, shopProducts), true));
        })
        .catch(() => {
          return next(ApiGenericResponse.successServerCode("Success", new GenericShopModel(shop, []), true));
        });
    } else {
      return next(ApiGenericResponse.successServerCode("Sorry,no shop found", shop, true));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getShospWithUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const shops = await ShopModel.find({ shop_owner_user_id: userId });
    if (shops && shops.length) {
      return next(ApiGenericResponse.successServerCode("Success", shops, true));
    } else {
      return next(ApiGenericResponse.successServerCode("Sorry,no shop found", [], true));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getShopsIdsByUserId = async (userId) => {
  return ShopModel.find({ shop_owner_user_id: userId }, { _id: 1 }).sort({ _id: 1 });
};

const getShopsWithShopIds = async (shopIds) => {
  return await ShopModel.find({ _id: shopIds }, { shop_tags: 0, days: 0, created_at: 0 }).sort({ _id: 1 });
};

const deleteShopById = async (req, res, next) => {
  try {
    const { loginuserid } = getHeaders(req);
    const { id } = req.params;
    const isRightUser = await validatingUserCanDeleteShop(loginuserid, id);
    if (isRightUser) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
    }
    const deletedShop = await ShopModel.deleteOne({ _id: id });
    if (!deletedShop) {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.DELETE_SHOP_SUCCESS, undefined, true));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

const updateShop = async (req, res, next) => {
  const { shop_name, shop_address, shop_mobile, shop_category_id, shop_image, description, shop_id, shop_tags, opening_time, closing_time, days, shopSearchString } = req.body;
  try {
    const updatedShop = await ShopModel.findOneAndUpdate({ _id: req.body._id }, { $set: { shop_name, shop_address, shop_mobile, shop_category_id, shop_image, description, shop_id, shop_tags, last_updated: new Date(), opening_time, closing_time, days, shopSearchString } });
    if (updatedShop) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, updatedShop, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getRandomShops = async (limit) => {
  return await ShopModel.find().limit(limit).sort({ _id: 1 });
};

const getShopWithUserId = async (id) => {
  try {
    return await ShopModel.findOne({ _id: id });
  } catch (err) {
    console.error(err);
  }
};

const validatingUserCanDeleteShop = async (userId, shopId) => {
  const shop = await getShopWithUserId(shopId);
  if (shop && userId !== shop.shop_owner_user_id) {
    return true;
  } else {
    return false;
  }
};

const otpVarificationForShop = async (req, res, next) => {
  try {
    const { otp, shopId } = req.body;
    const { loginuserid } = getHeaders(req);
    if (!otp) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_REQUIRED, undefined, false));
    if (!shopId) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_ID_REQUIRED, undefined, false));
    const shop = await ShopModel.findOne({ _id: shopId });
    if (shop && loginuserid && shop.shop_owner_user_id === loginuserid) {
      if (shop.otp === otp) {
        await ShopModel.update({ _id: shopId }, { $set: { is_shop_varified: true } });
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_SUCCESS_VARIFIED, undefined, true));
      } else {
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_NOT_MATCHING, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.USER_NOT_FOUND, undefined, false));
    }
  } catch (err) {
    console.error("otp---", err);
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

export { creatingShop, getAllShops, getShopsWithName, getShopWithId, getShospWithUserId, deleteShopById, updateShop, getShopsIdsByUserId, getShopsWithShopIds, getRandomShops, getShopWithUserId, otpVarificationForShop };
