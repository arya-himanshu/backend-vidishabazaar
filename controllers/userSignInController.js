import { getUserByMobileNumber } from "../services/userService.js";
import bcrypt from "bcrypt";
import ApiError from "../middleware/ApiError.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
// User login start from here
const userLogIn = async (request, response, next) => {
  const { mobile, password } = request.body;
  const user = await getUserByMobileNumber(mobile);
  if (user && user.data) {
    if (!user.data.is_user_verified) {
      const updatedUser = await VidishaBazaarUser.update({ _id: request.body.id }, { $set: { otp: Math.floor(100000 + Math.random() * 900000) } });
      if (updatedUser) {
        return next(ApiError.unauthorizedServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.USER_NOT_VERIFIED }));
      } else {
        return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
      }
    }
    bcrypt.compare(password, user.data.password, async function (error, result) {
      if (result) {
        const token = await user.data.generateAuthToken();
        return next(ApiError.successServerCode({ errorMsg: null, data: user }));
      } else if (!error) {
        return next(ApiError.unauthorizedServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.MOBILE_OR_PASSWORD_NOT_MATCHINF }));
      } else if (error) {
        return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR + " " + error }));
      }
    });
  } else {
    return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
  }
};

export { userLogIn };
