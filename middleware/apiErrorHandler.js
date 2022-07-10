import ApiGenericResponse from "./ApiGenericResponse.js";
const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiGenericResponse) {
    res.status(err.code).send(err);
    return;
  }
  res.status(500).json("Something went wrong");
};

export default apiErrorHandler;
