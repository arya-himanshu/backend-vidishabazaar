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
          if (isUserAuthentic) {
            if (verifyUser) {
              next();
            } else {
              return next(ApiGenericResponse.unauthorizedServerError("Logging out because the user is not authorized.", undefined, false));
            }
          } else {
            return next(ApiGenericResponse.unauthorizedServerError("The user is not authorized.", undefined, false));
          }
        } else {
          return next(ApiGenericResponse.unauthorizedServerError("You don't have access to write; please connect with admin.", undefined, false));
        }
      } else {
        return next(ApiGenericResponse.unauthorizedServerError("Data does not match the given details.", undefined, false));
      }
    } else {
      return next(ApiGenericResponse.unauthorizedServerError("A mobile number and token are required.", undefined, false));
    }
  } catch (error) {
    console.error(error);
    return next(ApiGenericResponse.unauthorizedServerError("Unauthorized user or internal server error", undefined, false));
  }
};

const getHeaders = (req) => {
  return req && req.headers ? req.headers : null;
};

export { auth, getHeaders };
