import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { CustomerInteractionDataModel } from "../models/customerInteractionDataModel.js";
import { getRandomShops, getShopsWithShopIds } from "./shopCRUDController.js";

const getRecentActivities = async (req, res, next) => {
  try {
    console.log("request--->")
    const { cookieId } = req.params;
    const recentAct = await getRecentActivitiesData(cookieId, "SHOP", 3);
    if (recentAct) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, recentAct, true));
    }
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_RESULT_FOUND, [], true));
  } catch (err) {
    console.error(err);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, [], false));
  }
};

const getRecentActivitiesData = async (cookieId, uniqueKey = "SHOP", limit) => {
  try {
    if (cookieId) {
      const activities = await CustomerInteractionDataModel.find({
        session_id: { $in: cookieId },
        unique_key: { $in: uniqueKey },
      })
        .limit(limit)
        .sort({ created_at: -1 });
      if (activities && activities.length) {
        const shopIds = activities.map((act) => act.shop_id);
        const shops = await getShopsWithShopIds(shopIds);
        return shops;
      }
    }
    const randomShops = await getRandomShops(6);
    return randomShops;
  } catch (err) {
    console.error(err);
  }
};

export { getRecentActivities };
