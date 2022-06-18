import jwt from "jsonwebtoken";
import ApiError from "../middleware/ApiError.js";
import { getUserByMobileNumber } from "../services/userService.js";

const auth = async (req, res, next) => {
  try {
    const { mobile, token } = req.body;
    if (mobile && token) {
      const user = await getUserByMobileNumber(mobile);
      if (user && user.data.mobile === mobile && user.data.tokens.length) {
        const isUserAuthentic = user.data.tokens.filter((el) => {
          return el.token === token;
        });
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        if (isUserAuthentic && verifyUser) {
          next();
        } else {
          return next(ApiError.badRequest({ errorMsg: "Data not matching with given details 1" }));
        }
      } else {
        return next(ApiError.badRequest({ errorMsg: "Data not matching with given details 2" }));
      }
    } else {
      return next(ApiError.badRequest({ errorMsg: "Mobile number and token is required 3" }));
    }
  } catch (error) {
    return next(ApiError.internalServerError({ errorMsg: "Internal server error"}));
  }
};

export { auth };
