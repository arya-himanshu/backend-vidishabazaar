import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { BusinessCategory } from "../models/businessCategoryModel.js";

const createCategory = (req, res, next) => {
  const { category_name, language } = req.body;
  if (!category_name) {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_NAME_REQUIRED, undefined, false));
  }

  if (!language) {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.LANGUAGE_REQUIRED, undefined, false));
  } else if (language && !language.english) {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.ENGLISH_LANGUAGE_REQUIRED, undefined, false));
  }
  try {
    isCategoryAlresdyCreated(category_name, async (error, response) => {
      if (error) {
        return next(ApiGenericResponse.successServerCode(response.message.replace("${category_name}", language.english), undefined, false));
      } else {
        const category = new BusinessCategory({ category_name, language, last_updated: new Date(), created_at: new Date() });
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

const isCategoryAlresdyCreated = async (category_name, callback) => {
  const category = await BusinessCategory.findOne({ category_name });
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
