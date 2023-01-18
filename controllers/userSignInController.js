import { getUserByMobileNumber, generateOtp, sendOtp } from "../services/userService.js";
import bcrypt from "bcrypt";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { VidishaBazaarUser } from "../models/userModel.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import UserModel from "../services/UserModel.js";
import { iotpd } from "./otpHistoryController.js";

// User login start from here
const userLogIn = async (request, response, next) => {
  try {
    const { mobile, password } = request.body;
    const user = await getUserByMobileNumber(mobile);
    if (user) {
      if (!user.is_user_verified) {
        const otp = generateOtp();
        const updatedUser = await VidishaBazaarUser.findOneAndUpdate(
          { _id: user._id },
          { $set: { otp: otp } },
          {
            fields: { otp: 0 },
            new: true,
          }
        );
        if (updatedUser) {
          sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, user.mobile);
          iotpd({ otp, user_id: updatedUser._id, shop_id: undefined, mobile: mobile });
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
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const resendSignInOtp = async (request, response, next) => {
  try {
    const { mobile } = request.body;
    const user = await getUserByMobileNumber(mobile);
    if (user) {
      const otp = generateOtp();
      const updatedUser = await VidishaBazaarUser.findOneAndUpdate(
        { _id: user._id },
        { $set: { otp: otp } },
        {
          fields: { otp: 0, password: 0, tokens: 0 },
          new: true,
        }
      );
      if (updatedUser) {
        sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, user.mobile);
        iotpd({ otp, user_id: updatedUser._id, shop_id: undefined, mobile: mobile });
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_SEND_SUCCESSFULLY, updatedUser, true));
      } else {
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.successServerCode("User not found", undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const deleteUserTokenOnLogOut = async (request, response, next) => {
  try {
    const { token, mobile } = request.headers;
    const user = await getUserByMobileNumber(mobile);
    if (user && user.tokens) {
      const tokens = user.tokens.filter((i) => i.token !== token);
      await VidishaBazaarUser.updateOne({ _id: user._id }, { $set: { tokens: tokens } });
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.SUCCESS, undefined, true));
    } else {
      return next(ApiGenericResponse.internalServerError("FAILED", undefined, false));
    }
  } catch (err) {
    console.error(err);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const userChangePassword = async (request, response, next) => {
  try {
    const { oldPass, newPass, confirmPass } = request.body;
    const { mobile, token } = request.headers;
    if (!oldPass) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OLD_PASS_RQUIRED, undefined, false));
    if (!newPass) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASSWORD_IS_REQUIRED, undefined, false));
    if (!confirmPass) next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CONFIRM_PASS_RQUIRED, undefined, false));
    const user = await getUserByMobileNumber(mobile);
    if (user && user.mobile) {
      const tokens = user.tokens.filter((i) => i.token !== token);
      if (!tokens || tokens && tokens.length === 0) return next(ApiGenericResponse.unauthorizedServerError(GENERIC_RESPONSE_MESSAGES.USER_NOT_VERIFIED, undefined, false));
      bcrypt.compare(oldPass, user.password, async function (error, result) {
        if (result) {
          if (newPass === confirmPass) {
            const hashPass = await bcrypt.hash(newPass, 10);
            const updatedPassword = await VidishaBazaarUser.updateOne({ _id: user._id }, { $set: { password: hashPass, otp: "" } });
            if (updatedPassword) {
              return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASS_UPDATE_SUCCESSFULLY, undefined, true));
            }
          } else {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASS_CONFIRMPASS_NOT_MATCHING, undefined, false));
          }
        } else {
          return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OLD_PASSWORD_NOT_MATCHING, undefined, false));
        }
      });
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const changePasswordOTP = async (req, response, next) => {
  try {
    const { mobile } = req.headers;
    const user = await getUserByMobileNumber(mobile);
    if (user) {
      const otp = generateOtp();
      const updatedUser = await VidishaBazaarUser.findOneAndUpdate(
        { _id: user._id },
        { $set: { otp: otp } },
        {
          fields: { otp: 0, password: 0, tokens: 0 },
          new: true,
        }
      );
      if (updatedUser) {
        sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, user.mobile);
        iotpd({ otp, user_id: updatedUser._id, shop_id: undefined, mobile: mobile });
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_SEND_SUCCESSFULLY, updatedUser, true));
      } else {
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      }
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

const forgotPassword = async (request, response, next) => {
  try {
    const { mobile, otp, newPass, confirmPass } = request.body;
    if (!otp) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_REQUIRED, undefined, false));
    if (!newPass) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASSWORD_IS_REQUIRED, undefined, false));
    if (!confirmPass) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.CONFIRM_PASS_RQUIRED, undefined, false));
    if (newPass !== confirmPass) return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASS_CONFIRMPASS_NOT_MATCHING, undefined, false));
    const user = await getUserByMobileNumber(mobile);
    if (user && user.mobile) {
      if (user.otp === otp) {
        const hashPass = await bcrypt.hash(newPass, 10);
        const updatedPassword = await VidishaBazaarUser.updateOne({ _id: user._id }, { $set: { password: hashPass, otp: "" } });
        if (updatedPassword) {
          return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.PASS_UPDATE_SUCCESSFULLY, undefined, true));
        }
      } else {
        return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_NOT_MATCHING, undefined, false));
      }
    } else {
      return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_NOT_MATCHING, undefined, false));
    }
  } catch (er) {
    console.error(er);
    return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
  }
};

export { userLogIn, resendSignInOtp, deleteUserTokenOnLogOut, userChangePassword, changePasswordOTP, forgotPassword };
