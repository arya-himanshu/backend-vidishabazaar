import { ShopModel } from "../models/shopRegistrationModel.js";
import ApiError from "../middleware/ApiError.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";

const creatingShop = async (req, res, next) => {
  const { shop_name, shop_gst_number, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_photo, is_shop_Physically_available } = req.body;
  console.log(req.body);
  if (!shop_name) return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.SHOP_NAME_REQUIRED }));
  if (!shop_owner_user_id) return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.SHOP_OWNER_ID_REQUIRED }));
  if (!shop_mobile) return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.SHOP_MOBILE_REQUIRED }));
  if (!shop_category_id) return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.SHOP_CATEGORY_ID_REQUIRED }));
  if (!shop_address) return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.SHOP_ADDRESS_REQUIRED }));

  try {
    const shop = await ShopModel({ shop_name, shop_gst_number: shop_gst_number, shop_owner_user_id, shop_address, shop_city, shop_pincode, shop_mobile, shop_category_id, shop_photo, is_shop_Physically_available, last_updated: new Date(), created_at: new Date(), is_shop_varified: false, is_shop_active: false, is_shop_Physically_available: true });
    if (shop) {
      const registeredShop = await shop.save();
      if (registeredShop) {
        return res.status(201).send({ data: registeredShop });
      } else {
        return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
      }
    } else {
      return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
    }
  } catch (er) {
    console.log(er);
    return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, error: er }));
  }
};

const getAllShops = async (req, res, next) => {
  const shops = await ShopModel.find({});
  try {
    if (shops && shops.length) {
      return next(ApiError.successServerCode({ data: shops }));
    } else {
      return next(ApiError.internalServerError(GENERIC_RESPONSE_MESSAGES.SHOP_NOT_FOUND));
    }
  } catch (er) {
    return next(ApiError.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};
export { creatingShop, getAllShops };
