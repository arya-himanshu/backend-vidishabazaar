import jwt from "jsonwebtoken";
import ApiGenericResponse from "../middleware/ApiGenericResponse.js";
import { getUserByMobileNumber } from "../services/userService.js";

const auth = async (req, res, next) => {
  try {
    const { mobile, token, loginuserid } = req.headers;
    if (mobile && token && loginuserid) {
      const user = await getUserByMobileNumber(mobile);
      if (user && user.mobile === mobile && user.tokens.length) {
        if (user._id.equals(loginuserid)) {
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
          return next(ApiGenericResponse.unauthorizedServerError({ errorMsg: "You don't have access to write,please connect with admin" }));
        }
      } else {
        return next(ApiGenericResponse.badRequest({ errorMsg: "Data not matching with given details 2" }));
      }
    } else {
      return next(ApiGenericResponse.badRequest({ errorMsg: "Mobile number and token is required 3" }));
    }
  } catch (error) {
    console.error(error);
    return next(ApiGenericResponse.unauthorizedServerError("UnAuthorize user or internal server error", undefined, false));
  }
};

const getHeaders = (req) => {
  return req && req.headers ? req.headers : null;
};

export { auth, getHeaders };
