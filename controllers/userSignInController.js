import { getUserByMobileNumber } from "../services/userService.js";
import bcrypt from "bcrypt";
import ApiError from "../error/ApiError.js";
// User login start from here
const userLogIn = (request, response, next) => {
  const { mobile, password } = request.body;
  getUserByMobileNumber(mobile)
    .then((data) => {
      if (data && data.data) {
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
        return next(ApiError.unauthorizedServerError({ errorMsg: "Mobile or password is not matching" }));
      }
    })
    .catch((error) => {
      if (error && error.errorMsg) {
        return next(ApiError.internalServerError({ errorMsg: error.errorMsg }));
      } else {
        return next(ApiError.internalServerError({ errorMsg: "Internal server  error" }));
      }
    });
};

export { userLogIn };
