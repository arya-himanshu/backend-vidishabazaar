class ApiError {
  constructor(code, errObj) {
    this.code = code;
    this.errorObj = errObj;
  }

  static badRequest(errObj) {
    return new ApiError(400, errObj);
  }

  static internalServerError(errObj) {
    return new ApiError(500, errObj);
  }
  
  static unauthorizedServerError(errObj) {
    return new ApiError(401, errObj);
  }

  static conflictServerError(errObj) {
    return new ApiError(409, errObj);
  }

  static successServerCode(errObj) {
    return new ApiError(201, errObj);
  }

}

export default ApiError;
