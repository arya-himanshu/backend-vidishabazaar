import ApiError from "./ApiError.js";
const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).send(err.errorObj);
    return;
  }

  res.status(500).json("Something went wrong");
};

export default apiErrorHandler;
