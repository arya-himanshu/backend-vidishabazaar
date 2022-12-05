import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import { TranslateLanguageString } from "../models/languageTranslateStringModel.js";

const createTranslateString = async (req, res, next) => {
  const { language_string, string_text } = req.body;
  if (!language_string) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.LANGUAGE_STRING, undefined, false));
  if (!string_text) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.STRING_TEXT, undefined, false));
  try {
    const stringText = await TranslateLanguageString.findOne({ string_text });
    if (!stringText) {
      const languageString = await TranslateLanguageString({ language_string, string_text, last_updated: new Date(), created_at: new Date() });
      if (languageString) {
        const registeredStrings = await languageString.save();
        if (registeredStrings) {
          return res.status(201).send(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS_LANGUAGE_STRING, registeredStrings, true));
        } else {
          return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
        }
      } else {
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.STRING_ALREADY_EXIST, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const getAllTranslateStrings = async (req, res, next) => {
  try {
    const strings = await TranslateLanguageString.find({}, { _id: 0, created_at: 0, last_updated: 0 });
    if (strings && strings.length) {
      const result = strings.reduce((map, obj) => {
        map[obj.string_text] = obj.language_string;
        return map;
      }, {});
      return next(ApiGenericResponse.successServerCode("Success", result, true));
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.STRING_NOT_FOUND, undefined, false));
    }
  } catch (er) {
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

export { createTranslateString, getAllTranslateStrings };
