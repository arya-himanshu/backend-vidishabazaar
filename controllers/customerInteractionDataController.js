import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { CustomerInteractionDataModel } from "../models/customerInteractionDataModel.js";
import { getShopsIdsByUserId } from "./shopCRUDController.js";

const customerInteractionData = async (req, res, next) => {
  const { session_id, user_id, unique_key, item_text, category_id, sub_category_id, shop_id, banner_id} = req.body;
  try {
    const generalMetrics = await CustomerInteractionDataModel({ session_id, item_text, user_id, unique_key, category_id, sub_category_id, shop_id, banner_id, last_updated: new Date(), created_at: new Date() });
    if (generalMetrics) {
      const createdMetrics = await generalMetrics.save();
      if (createdMetrics) {
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, registeredProduct, true));
      } else {
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG, undefined, false));
      }
    } else {
      return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
    }
  } catch (err) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.URL_PATH_REQUIRED, undefined, false));
  }
};

const getShopsImpressionDataByOwnerId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const shopsByUserId = await getShopsIdsByUserId(userId);
    if (shopsByUserId) {
      let shopImpressionDataMap = {};
      const shopIds = shopsByUserId.map((shop) => {
        shopImpressionDataMap[shop._id] = [];
        return shop._id;
      });
      const shopImpressionData = await getShopImpressionDataByShopId(shopIds);
      if (shopImpressionData) {
        shopImpressionData.map((impression) => {
          if (impression.shop_id && shopImpressionDataMap[impression.shop_id]) {
            shopImpressionDataMap[impression.shop_id].push(impression);
            shopImpressionDataMap[impression.shop_id] = shopImpressionDataMap[impression.shop_id];
          }
        });
      }
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, { totalImpression: shopImpressionData.length, shopImpressionDataMap }, true));
    }
  } catch (er) {
    console.error(er);
  }
};

const getShopImpressionDataByShopId = async (shopId) => {
  return await CustomerInteractionDataModel.find({
    shop_id: { $in: shopId },
  });
};

export { customerInteractionData, getShopsImpressionDataByOwnerId, getShopImpressionDataByShopId };
