import { getUserByMobileNumber } from "../services/userService.js";
import bcrypt from "bcrypt";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import UserModel from "../services/UserModel.js";

// User login start from here
const userLogIn = async (request, response, next) => {
  const { mobile, password } = request.body;
  const user = await getUserByMobileNumber(mobile);
  if (user) {
    if (!user.is_user_verified) {
      const updatedUser = await VidishaBazaarUser.update({ _id: request.body.id }, { $set: { otp: Math.floor(100000 + Math.random() * 900000) } });
      if (updatedUser) {
        const userData = new UserModel(user);
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.USER_NOT_VERIFIED, userData, true));
      } else {
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    }
    bcrypt.compare(password, user.password, async function (error, result) {
      if (result) {
        const token = await user.generateAuthToken();
        const userData = new UserModel(user);
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SIGNIN_SUCESS, userData, true));
      } else if (!error) {
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.MOBILE_OR_PASSWORD_NOT_MATCHINF, undefined, false));
      } else if (error) {
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR + " " + error, undefined, false));
      }
    });
  } else {
    return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.USER_NOT_FOUND, undefined, false));
  }
};

export { userLogIn };
