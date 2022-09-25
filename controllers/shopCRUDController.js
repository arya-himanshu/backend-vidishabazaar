import { ShopModel } from "../models/shopRegistrationModel.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { getUserById } from "../services/userService.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import { getProductsWithShopId } from "./addShopProductController.js";
import GenericShopModel from "../services/GenericShopModel.js";
const creatingShop = async (req, res, next) => {
  const { shop_name, shop_gst_number, tags, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_image, is_shop_Physically_available, shop_id } = req.body;
  if (!shop_name) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_NAME_REQUIRED, undefined, false));
  if (!shop_owner_user_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_OWNER_ID_REQUIRED, undefined, false));
  if (!shop_mobile) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_MOBILE_REQUIRED, undefined, false));
  if (!shop_category_id) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_CATEGORY_ID_REQUIRED, undefined, false));
  if (!shop_address) return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SHOP_ADDRESS_REQUIRED, undefined, false));

  try {
    const shop = await ShopModel({ shop_name, shop_gst_number: shop_gst_number, tags, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_image, is_shop_Physically_available, last_updated: new Date(), created_at: new Date(), is_shop_varified: false, is_shop_active: false, is_shop_Physically_available: true, shop_id });
    if (shop) {
      const registeredShop = await shop.save();
      if (registeredShop) {
        const x = await VidishaBazaarUser.update({ _id: shop_owner_user_id }, { $set: { userRole: "ADMIN" } });
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_CREATED_SUCCESSFULY, registeredShop, true));
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

const getAllShops = async (req, res, next) => {
  try {
    const searchString = req.query.searchString;
    const pageNumber = req.query.pageNumber;
    const nPerPage = req && req.query.nPerPage && req.query.nPerPage ? req.query.nPerPage : 10;
    let shopsCount = await ShopModel.count();
    let shops;
    if (searchString && searchString.length) {
      shops = await ShopModel.find({ shop_name: { $regex: searchString, $options: "i" } })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
      shopsCount = await (await ShopModel.find({ shop_name: { $regex: searchString, $options: "i" } })).length;
    } else {
      shops = await ShopModel.find({})
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage);
    }

    if (shops && shops.length) {
      return next(ApiGenericResponse.successServerCode("Success", { shops, itemsCount: shopsCount }, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND, undefined, false));
    }
  } catch (er) {
    console.log(er);
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

export { creatingShop, getAllShops, getShopsWithName, getShopWithId };
