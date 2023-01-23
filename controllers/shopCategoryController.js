import { ShopCategory } from "../models/shopCategoryModel.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";

const shopCategory = (req, res, next) => {
  try {
    const { name, language } = req.body;
    if (!name) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.CATEGORY_NAME_REQUIRED));
    }

    if (!language) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.LANGUAGE_REQUIRED));
    } else if (language && !language.in_eg) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.ENGLISH_LANGUAGE_REQUIRED));
    }

    isCategoryAlresdyCreated(name, async (error, response) => {
      if (error) {
        return next(ApiGenericResponse.badRequest(response.message.replace("${name}", language.in_eg)));
      } else {
        const category = new ShopCategory({ name, language, last_updated: new Date(), created_at: new Date() });
        const registeredCategory = await category.save();
        if (registeredCategory) {
          return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_CREATED));
        } else {
          return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.CATEGORY_CREATION_FAILED));
        }
      }
    });
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

const getAllShopCategory = async (req, res, next) => {
  try {
    const categories = await ShopCategory.find({});
    if (categories && categories.length) {
      return next(ApiGenericResponse.successServerCode("Success", categories, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_NOT_FOUND, undefined, false));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.CATEGORY_Id_REQUIRED));
    }
    const categories = await ShopCategory.findOne({ _id: id });
    if (categories) {
      return next(ApiGenericResponse.successServerCode({ data: categories }));
    } else {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.CATEGORY_NOT_FOUND));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

const isCategoryAlresdyCreated = async (name, callback) => {
  const category = await ShopCategory.findOne({ name });
  if (category) {
    callback(true, { message: GENERIC_RESPONSE_MESSAGES.CATEGORY_ALREADY_CREATED });
  } else {
    callback(undefined, {});
  }
};

const updateCategorybyId = async (req, res, next) => {
  try {
    const { _id, name, language } = req.body;
    if (!_id) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.CATEGORY_Id_REQUIRED));
    }
    const updatedCatgory = await ShopCategory.updateOne({ _id: _id }, { $set: { name: name, language } });
    if (!updatedCatgory) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_UPDATED));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await ShopCategory.deleteOne({ _id: id });
    if (!deletedCategory) {
      return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_DELETED));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR));
  }
};

export { shopCategory, getAllShopCategory, getCategoryById, updateCategorybyId, deleteCategoryById };
