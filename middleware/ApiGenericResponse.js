class ApiGenericResponse {
  constructor(code, msg, data, isSuccess) {
    this.code = code;
    this.msg = msg;
    this.data = data;
    this.isSuccess = isSuccess;
  }

  static badRequest(msg, data, isSuccess) {
    return new ApiGenericResponse(400, msg, data, isSuccess);
  }

  static internalServerError(msg, data, isSuccess) {
    return new ApiGenericResponse(500, msg, data, isSuccess);
  }

  static unauthorizedServerError(msg, data, isSuccess) {
    return new ApiGenericResponse(401, msg, data, isSuccess);
  }

  static conflictServerError(msg, data, isSuccess) {
    return new ApiGenericResponse(409, msg, data, isSuccess);
  }

  static successServerCode(msg, data, isSuccess) {
    return new ApiGenericResponse(201, msg, data, isSuccess);
  }
}

export default ApiGenericResponse;
