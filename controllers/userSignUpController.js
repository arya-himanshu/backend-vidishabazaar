import { VidishaBazaarUser } from "../models/userModel.js";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { getUserByMobileNumber, getUserById, generateOtp, sendOtp } from "../services/userService.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";
import UserModel from "../services/UserModel.js";
import http from 'http'

const userSignUp = async (req, response, next) => {
  try {
    const { name, dob, mobile, email, password, confirm_password } = req.body;
    if (!name) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.FIRST_NAME_REQUIRED, undefined, false));
    }
    if (!dob) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.DOB, undefined, false));
    }
    if (!mobile) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.MOBILE_IS_REQUIRED, undefined, false));
    } else if (mobile && mobile.length != 10) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.MOBILE_IN_10_DIGIT), undefined, false);
    }
    if (password && confirm_password && password !== confirm_password) {
      return next(ApiGenericResponse.unauthorizedServerError(GENERIC_RESPONSE_MESSAGES.PASS_CONFIRMPASS_NOT_MATCHING, undefined, false));
    } else if (!password) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.PASSWORD_IS_REQUIRED, undefined, false));
    } else if (!confirm_password) {
      return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.CONFIRM_PASS_IS_REQUIRED, undefined, false));
    }
    // Checking if user exist or not
    getUserByMobileNumber(mobile)
      .then(async (data) => {
        if (data) {
          return next(ApiGenericResponse.conflictServerError(`${GENERIC_RESPONSE_MESSAGES.USER_ALREDY_EXIST} ${mobile} number`, undefined, false));
        } else {
          const otp = generateOtp();
          const user = await new VidishaBazaarUser({
            name,
            dob,
            mobile,
            email,
            password,
            confirm_password,
            otp,
            last_updated: new Date(),
            created_at: new Date(),
            is_user_active: true,
          });
          const token = await user.generateAuthToken();
          if (!token) {
            console.error(GENERIC_RESPONSE_MESSAGES.TOKEN_NOT_INSERTED);
          }
          const registeredUser = await user.save();
          if (registeredUser) {
            sendOtp(`Dear Customer, your otp is ${otp} .please do not share with anyone. Thanks RNIT`, registeredUser.mobile);
            const userData = new UserModel(registeredUser);
            return next(ApiGenericResponse.successServerCode("User created successfully", userData, true));
          } else {
            return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG, undefined, false));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        if (error && error.errors && error.errors.mobile) {
          return next(ApiGenericResponse.internalServerError(error.errors.mobile.message, undefined, false));
        } else {
          return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
        }
      });
  } catch (er) {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.OTP_USER_NOT_FOUND, undefined, false));
  }
};

const mobileOptValidation = (req, res, next) => {
  if (req.body.otp && req.body.id) {
    getUserById(req.body.id)
      .then(async (data) => {
        if (data && data.otp) {
          const dbOtp = data.otp;
          if (dbOtp === req.body.otp) {
            const updatedUser = await VidishaBazaarUser.update({ _id: req.body.id }, { $set: { is_user_verified: true } });
            if (updatedUser) {
              const userData = new UserModel(data);
              return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.USER_VERIFIED, userData, true));
            } else {
              console.error(error);
              return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
            }
          } else {
            return next(ApiGenericResponse.successServerCode(GENERIC_RESPONSE_MESSAGES.OTP_NOT_MATCHING, undefined, false));
          }
        } else {
          return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.OTP_USER_NOT_FOUND, undefined, false));
        }
      })
      .catch((error) => {
        console.error(error);
        return next(ApiGenericResponse.internalServerError(GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, undefined, false));
      });
  } else {
    return next(ApiGenericResponse.badRequest(GENERIC_RESPONSE_MESSAGES.OTP_USER_NOT_FOUND, undefined, false));
  }
};

export { userSignUp, mobileOptValidation };
