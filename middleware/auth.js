import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js";

const auth = async (req, res, next) => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTU0OTA5NjV9.0Q3EV0MPrsTvwlvuNDIebOFFuBY_V1V--A3IdoMqF-s";
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    next();
  } catch (error) {
    return next(ApiError.unauthorizedServerError({ errorMsg: "unser not logined" }));
  }
};

export { auth };
