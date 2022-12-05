import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { HomeBannerAdsModel } from "../models/homeBannerAdsModel.js";
import { getUserByMobileNumber } from "../services/userService.js";

const getHomeBannerAds = async (req, res, next) => {
  try {
    const banners = await getAllBanner();
    if (banners) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, banners, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_BANNER_FOUND, [], true));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const addHomeBannerAds = async (req, res, next) => {
  const { banner_image, customer_mobile, url, ads_validity } = req.body;
  const { mobile } = req.headers;
  const user = await getUserByMobileNumber(mobile);
  if (!user || (user && user.userRole && user.userRole !== "SUPER_ADMIN")) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.NO_PERMISSION, undefined, false));
  }
  const existingBanner = await getAllBanner();
  if (existingBanner && existingBanner.length >= 3) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.BANNER_ALREDY_FULL, undefined, false));
  }

  if (!banner_image) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.BANNER_IMAGE_REQUIRED, undefined, false));
  }

  if (!customer_mobile) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CUSTOMER_MOBILE_REQUIRED, undefined, false));
  }

  if (!url) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.URL_REQURED, undefined, false));
  }

  try {
    const bannerAd = new HomeBannerAdsModel({ banner_image, customer_mobile, url, ads_validity, last_updated: new Date(), created_at: new Date() });
    const createdBannerAd = await bannerAd.save();
    if (createdBannerAd) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.BANNER_CREATED_SUCCESSFULLY, createdBannerAd, true));
    } else {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.BANNER_CREATION_FAILED, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getAllBanner = async () => {
  try {
    const banners = await HomeBannerAdsModel.find();
    if (banners) {
      return banners;
    } else {
      return [];
    }
  } catch (er) {
    console.error(er);
    return er;
  }
};
export { getHomeBannerAds, addHomeBannerAds };
