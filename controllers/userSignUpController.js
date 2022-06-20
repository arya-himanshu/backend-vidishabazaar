import { VidishaBazaarUser } from "../models/userModel.js";
import ApiError from "../middleware/ApiError.js";
import { getUserByMobileNumber, getUserById } from "../services/userService.js";
import GENERIC_RESPONSE_MESSAGES from "../enums/genericResponseEnums.js";

const userSignUp = async (request, response, next) => {
  const { name, dob, mobile, email, password, confirm_password, role_id } = request.body;

  if (!name) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.FIRST_NAME_REQUIRED }));
  }

  if (!dob) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.DOB }));
  }

  if (!mobile) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.MOBILE_IS_REQUIRED }));
  } else if (mobile && mobile.length != 10) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.MOBILE_IN_10_DIGIT }));
  }

  if (password && confirm_password && password !== confirm_password) {
    return next(ApiError.unauthorizedServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.PASS_CONFIRMPASS_NOT_MATCHING }));
  } else if (!password) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.PASSWORD_IS_REQUIRED }));
  } else if (!confirm_password) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.CONFIRM_PASS_IS_REQUIRED }));
  }

  if (!role_id) {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.ROLE_IS_REQUIRED }));
  }

  // Checking if user exist or not
  getUserByMobileNumber(mobile)
    .then(async (data) => {
      if (data && data.data) {
        return next(ApiError.conflictServerError({ errorMsg: `${GENERIC_RESPONSE_MESSAGES.USER_ALREDY_EXIST}  ${mobile} number` }));
      } else {
        const user = await new VidishaBazaarUser({
          name,
          dob,
          mobile,
          email,
          password,
          confirm_password,
          role_id,
          otp: Math.floor(100000 + Math.random() * 900000),
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
          return next(ApiError.successServerCode({ errorMsg: null, data: registeredUser }));
        } else {
          return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.SOMETHING_WENT_WRONG, error: "error.errors.mobile.message" }));
        }
      }
    })
    .catch((error) => {
      return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR, error: error.errors.mobile }));
    });
};

const mobileOptValidation = (req, res, next) => {
  if (req.body.otp && req.body.id) {
    getUserById(req.body.id)
      .then(async (data) => {
        if (data && data.data && data.data.otp) {
          const dbOtp = data.data.otp;
          if (dbOtp === req.body.otp) {
            const updatedUser = await VidishaBazaarUser.update({ _id: req.body.id }, { $set: { is_user_verified: true } });
            if (updatedUser) {
              return next(ApiError.successServerCode({ errorMsg: null, successMsg: GENERIC_RESPONSE_MESSAGES.USER_VERIFIED, data }));
            } else {
              console.log(error);
              return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
            }
          } else {
            return next(ApiError.unauthorizedServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.OTP_NOT_MATCHING }));
          }
        } else {
          return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.OTP_USER_NOT_FOUND }));
        }
      })
      .catch((error) => {
        console.log(error);
        return next(ApiError.internalServerError({ errorMsg: GENERIC_RESPONSE_MESSAGES.INTERNAM_SERVER_ERROR }));
      });
  } else {
    return next(ApiError.badRequest({ errorMsg: GENERIC_RESPONSE_MESSAGES.OTP_USER_NOT_FOUND }));
  }
};

export { userSignUp, mobileOptValidation };
