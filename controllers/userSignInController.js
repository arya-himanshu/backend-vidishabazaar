import { getUserByMobileNumber } from "../services/userService.js";
import bcrypt from "bcrypt";
import ApiError from "../middleware/ApiError.js";
import { VidishaBazaarUser } from "../models/userModel.js";
// User login start from here
const userLogIn = async (request, response, next) => {
  const { mobile, password } = request.body;
  const user = await getUserByMobileNumber(mobile);
  if (user && user.data) {
    if (!user.data.is_user_verified) {
      const updatedUser = await VidishaBazaarUser.update({ _id: request.body.id }, { $set: { otp: Math.floor(100000 + Math.random() * 900000) } });
      if (updatedUser) {
        return next(ApiError.unauthorizedServerError({ errorMsg: "User is not verified please verify the user with OTP" }));
      } else {
        return next(ApiError.internalServerError({ errorMsg: "Internal server  error" }));
      }
    }
    bcrypt.compare(password, data.data.password, async function (error, result) {
      if (result) {
        const token = await data.data.generateAuthToken();
        return next(ApiError.successServerCode({ errorMsg: null, data: data }));
      } else if (!error) {
        return next(ApiError.unauthorizedServerError({ errorMsg: "Mobile or password is not matching + " }));
      } else if (error) {
        return next(ApiError.internalServerError({ errorMsg: "Internal server  error >" + error }));
      }
    });
  } else {
    return next(ApiError.internalServerError({ errorMsg: "Internal server  error" }));
  }
};

export { userLogIn };
