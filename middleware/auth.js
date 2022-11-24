import jwt from "jsonwebtoken";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { getUserByMobileNumber } from "../services/userService.js";

const auth = async (req, res, next) => {
  try {
    const { mobile, token } = req.headers;
    if (mobile && token) {
      const user = await getUserByMobileNumber(mobile);
      if (user && user.mobile === mobile && user.tokens.length) {
        const isUserAuthentic = user.tokens.filter((el) => {
          return el.token === token;
        });
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        if (isUserAuthentic && verifyUser) {
          next();
        } else {
          return next(ApiGenericResponse.badRequest({ errorMsg: "Data not matching with given details 1" }));
        }
      } else {
        return next(ApiGenericResponse.badRequest({ errorMsg: "Data not matching with given details 2" }));
      }
    } else {
      return next(ApiGenericResponse.badRequest({ errorMsg: "Mobile number and token is required 3" }));
    }
  } catch (error) {
    console.error(error);
    return next(ApiGenericResponse.internalServerError({ errorMsg: "Internal server error" }));
  }
};

export { auth };
