import ApiError from "../middleware/ApiError.js";
import userRole from "../models/userRoleModel.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";

const createUserRole = async (req, res, next) => {
  const { role_type } = req.body;
  console.log(req.body);
  if (!role_type) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.ROLE_IS_REQUIRED }));
  }
  try {
    const roleType = await userRole({ role_type, last_updated: new Date(), created_at: new Date() });
    if (roleType) {
      const registeredRoleType = await roleType.save();
      if (registeredRoleType) {
        return next(ApiError.successServerCode({ errorMsg: null, data: registeredRoleType }));
      } else {
        return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG, error: undefined }));
      }
    } else {
      return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG + " " + GENERIC_RESPONSE_MESSAGES.PLEASE_TRY_AGAIN, error: undefined }));
    }
  } catch (error) {
    console.error(error);
    return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG, error: error.errors.mobile.message }));
  }
};

export { createUserRole };
