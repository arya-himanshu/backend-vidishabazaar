import { ShopModel } from "../models/shopRegistrationModel.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import { getProductsWithShopId } from "./addShopProductController.js";
import GenericShopModel from "../services/GenericShopModel.js";
import { getHeaders } from "../middleware/auth.js";
import { generateOtp, sendOtp } from "../services/userService.js";
import { iotpd } from "./otpHistoryController.js";

const creatingShop = async (req, res, next) => {
  try {
    const { name, owner_user_id, address, mobile, category_id, images, is_shop_Physically_available, shop_id, description, shop_tags, opening_time, closing_time, days, search_string, map_lng_lat } = req.body;
    if (!name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_NAME_REQUIRED, undefined, false));
    if (!owner_user_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_OWNER_ID_REQUIRED, undefined, false));
    if (!mobile) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_MOBILE_REQUIRED, undefined, false));
    if (!category_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_CATEGORY_ID_REQUIRED, undefined, false));
    if (!address) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ADDRESS_REQUIRED, undefined, false));
    const otp = generateOtp();
    const shop = await ShopModel({ name, owner_user_id, address, city: "vidisha", pincode: "464001", mobile, category_id, images, is_shop_Physically_available, last_updated: new Date(), created_at: new Date(), is_shop_varified: false, is_shop_active: false, is_shop_Physically_available: true, shop_id, description, shop_tags: shop_tags, opening_time, closing_time, days, search_string, otp: otp, map_lng_lat });
    if (shop) {
      const registeredShop = await shop.save();
      if (registeredShop) {
        sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, mobile);
        await VidishaBazaarUser.update({ _id: owner_user_id }, { $set: { userRole: "ADMIN" } });
        iotpd({ otp, user_id: registeredShop.owner_user_id, shop_id: registeredShop._id, mobile: mobile });
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_CREATED_SUCCESSFULY, new GenericShopModel(registeredShop, []), true));
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
    let multiStringsSearch = [];
    const nameRegex = searchString
      ? searchString.split(" ").map((s) => {
          return { name: { $regex: s, $options: "i" } };
        })
      : [];
    const addressRegex = searchString
      ? searchString.split(" ").map((s) => {
          return { address: { $regex: s, $options: "i" } };
        })
      : [];
    const mobileRegex = searchString
      ? searchString.split(" ").map((s) => {
          return { mobile: { $regex: s, $options: "i" } };
        })
      : [];
    const descriptionRegex = searchString
      ? searchString.split(" ").map((s) => {
          return { description: { $regex: s, $options: "i" } };
        })
      : [];
    const search_stringRegex = searchString
      ? searchString.split(" ").map((s) => {
          return { search_string: { $regex: s, $options: "i" } };
        })
      : [];
    multiStringsSearch = [...nameRegex, ...addressRegex, ...mobileRegex, ...descriptionRegex, ...search_stringRegex];
    if (subCategoryId && searchString) {
      shops = await ShopModel.find({ category_id: subCategoryId, $or: [{ name: { $regex: `/${searchString}/i`, $options: "i" } }, { address: { $regex: searchString, $options: "i" } }, { mobile: { $regex: searchString, $options: "i" } }, { search_string: { $regex: searchString, $options: "i" } }, { opening_time: { $regex: searchString, $options: "i" } }, { closing_time: { $regex: searchString, $options: "i" } }, { description: { $regex: searchString, $options: "i" } }] }, { otp: 0 })
        .sort({ created_at: -1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({ category_id: subCategoryId, $or: [{ name: { $regex: `/${searchString}/i`, $options: "i" } }, { address: { $regex: searchString, $options: "i" } }, { mobile: { $regex: searchString, $options: "i" } }, { search_string: { $regex: searchString, $options: "i" } }, { opening_time: { $regex: searchString, $options: "i" } }, { closing_time: { $regex: searchString, $options: "i" } }, { description: { $regex: searchString, $options: "i" } }] });
    } else if (subCategoryId) {
      shops = await ShopModel.find({ category_id: subCategoryId }, { otp: 0 })
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({ category_id: subCategoryId });
    } else if (searchString) {
      shops = await ShopModel.find(
        {
          $or: multiStringsSearch,
        },
        { otp: 0 }
      )
        .sort({ created_at: -1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await ShopModel.count({
        $or: multiStringsSearch,
      });
    } else {
      shops = await ShopModel.find({}, { otp: 0 })
        .sort({ created_at: -1 })
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
    const shops = await ShopModel.find({ name: { $regex: req.query.searchString, $options: "i" } }, { otp: 0 });
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
    const shop = await ShopModel.findOne({ _id: id }, { otp: 0 });
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
    const shops = await ShopModel.find({ owner_user_id: userId }, { otp: 0 });
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
  return ShopModel.find({ owner_user_id: userId }, { _id: 1, otp: 0 }).sort({ _id: 1 });
};

const getShopsWithShopIds = async (shopIds) => {
  return await ShopModel.find({ _id: shopIds }, { shop_tags: 0, days: 0, created_at: 0, otp: 0 }).sort({ _id: 1 });
};

const deleteShopById = async (req, res, next) => {
  try {
    const { loginuserid } = getHeaders(req);
    const { id } = req.params;
    const isRightUser = await validatingUserCanDeleteShop(loginuserid, id);
    if (isRightUser) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
    }
    const deletedShop = await ShopModel.deleteOne({ _id: id }, { otp: 0 });
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
  try {
    const { name, address, mobile, category_id, images, description, shop_id, shop_tags, opening_time, closing_time, days, search_string, map_lng_lat } = req.body;
    if (images && images >= 2) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.TWO_IMAGE_ALLOWED, undefined, false));
    }
    let otp;
    const existingShop = await ShopModel.findOne({ _id: req.body._id });
    if (existingShop && !existingShop.is_shop_varified) {
      otp = generateOtp();
      sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, mobile);
      iotpd({ otp, user_id: existingShop.owner_user_id, shop_id: existingShop._id, mobile: mobile });
    }
    const updatedShop = await ShopModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { name, address, mobile, category_id, images, description, shop_id, shop_tags, last_updated: new Date(), opening_time, closing_time, days, search_string, otp, map_lng_lat } },
      {
        fields: { otp: 0 },
        new: true,
      }
    );
    if (updatedShop) {
      iotpd({ otp, user_id: updatedShop.owner_user_id, shop_id: updatedShop._id, mobile: mobile });
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
  return await ShopModel.find({}, { otp: 0 }).limit(limit).sort({ _id: 1 });
};

const getShopWithUserId = async (id) => {
  try {
    return await ShopModel.findOne({ _id: id }, { otp: 0 });
  } catch (err) {
    console.error(err);
  }
};

const validatingUserCanDeleteShop = async (userId, shopId) => {
  const shop = await getShopWithUserId(shopId);
  if (shop && userId !== shop.owner_user_id) {
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
    if (shop && loginuserid && shop.owner_user_id === loginuserid) {
      if (shop.otp === otp) {
        await ShopModel.update({ _id: shopId }, { $set: { is_shop_varified: true, otp: "" } });
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

const resendShopOtp = async (request, response, next) => {
  try {
    const { _id, mobile } = request.body;
    if (mobile) {
      const otp = generateOtp();
      const updatedShop = await ShopModel.findOneAndUpdate(
        { _id: _id },
        { $set: { otp } },
        {
          fields: { otp: 0 },
          new: true,
        }
      );
      if (updatedShop) {
        sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, mobile);
        iotpd({ otp, user_id: updatedShop.owner_user_id, shop_id: updatedShop._id, mobile: mobile });
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_SEND_SUCCESSFULLY, request.body, true));
      } else {
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const addProductNameToShopSearchString = async (productObj) => {
  try {
    const shop = await getShopById(productObj.shop_id);
    return await ShopModel.updateOne({ _id: productObj.shop_id }, { $set: { search_string: `${shop.search_string} ${productObj.name}` } });
  } catch (er) {
    console.error(er);
    return er;
  }
};

const getShopById = async (shopId) => {
  try {
    return await ShopModel.findOne({ _id: shopId }, { otp: 0 });
  } catch (er) {
    console.error(er);
  }
};

const updateShopImpressionCount = async (shopObj) => {
  try {
    const shop = await getShopById(shopObj.shopId);
    return await ShopModel.updateOne({ _id: shopObj.shopId }, { $set: { impression_count: shop.impression_count ? shop.impression_count+ shopObj.count : 1} });
  } catch (er) {
    console.error(er);
    return er;
  }
};

export { creatingShop, getAllShops, getShopsWithName, getShopWithId, getShospWithUserId, deleteShopById, updateShop, getShopsIdsByUserId, getShopsWithShopIds, getRandomShops, getShopWithUserId, otpVarificationForShop, resendShopOtp, addProductNameToShopSearchString,updateShopImpressionCount };
