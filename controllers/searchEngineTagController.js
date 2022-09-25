import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { SearchTagsModel } from "../models/searchTagsModel.js";

const searchEngineTag = async (req, res, next) => {
  const { category_id, categoryUrl, tags } = req.body;
  if (!category_id) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_Id_REQUIRED, undefined, false));
  if (!categoryUrl) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CATEGORY_URL_REQUIRED, undefined, false));
  if (!tags) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.TAG, undefined, false));
  try {
    const seachEngineTags = await SearchTagsModel({ category_id, categoryUrl, tags, last_updated: new Date(), created_at: new Date() });
    if (seachEngineTags) {
      const registeredTags = await seachEngineTags.save();
      if (registeredTags) {
        return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.TAG_CREATED, registeredTags, true));
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

const searchCategoryWithTags = async (req, res, next) => {
  const {tags} = req.body;
  try {
      console.log(tags)
    const searchData = await SearchTagsModel.find({ favoriteFood : { $all : tags }} );
    res.send(searchData);
  } catch (er) {}
};
export { searchEngineTag, searchCategoryWithTags };
