import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { BusinessCategory } from "../models/businessCategoryModel.js";

const createCategory = (req, res, next) => {
  const { name, language, url_path } = req.body;
  if (!name) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_NAME_REQUIRED, undefined, false));
  }

  if (!url_path) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.URL_PATH_REQUIRED, undefined, false));
  }

  if (!language) {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.LANGUAGE_REQUIRED, undefined, false));
  } else if (language && !language.in_eg) {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.ENGLISH_LANGUAGE_REQUIRED, undefined, false));
  }
  try {
    isCategoryAlresdyCreated(name, async (error, response) => {
      if (error) {
        return next(ApiGenericResponse.successServerCode(response.message.replace("${name}", language.in_eg), undefined, false));
      } else {
        const category = new BusinessCategory({ name, url_path, language, last_updated: new Date(), created_at: new Date() });
        const registeredCategory = await category.save();
        if (registeredCategory) {
          return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_CREATED, registeredCategory, true));
        } else {
          return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.CATEGORY_CREATION_FAILED, undefined, false));
        }
      }
    });
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const isCategoryAlresdyCreated = async (name, callback) => {
  const category = await BusinessCategory.findOne({ name });
  if (category) {
    callback(true, { message: GENERIC_RESPONSE_MESSAGES.CATEGORY_ALREADY_CREATED });
  } else {
    callback(undefined, {});
  }
};

const getAllBusinessCategory = async (req, res, next) => {
  const categories = await BusinessCategory.find({});
  try {
    if (categories && categories.length) {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_CREATED, categories, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_NOT_FOUND, undefined, false));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};
export { createCategory, getAllBusinessCategory };
