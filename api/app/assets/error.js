class Error {
  static getByCode(code, message = null) {
    const err = {
      status: 0,
      data: {
        success: false,
        code: code,
        message: message
      },
    };

    switch (code) {
      case 'INVALID_CREDS':
      case 'INVALID_PARAMETERS':
        err.status = 400;
        break;
      case 'UNAUTHORIZED':
        err.status = 401;
        break;
      case 'NOT_FOUND':
        err.status = 404;
        break;
      case 'ALREADY_EXISTS':
        err.status = 409;
        break;
      case 'UNKNOWN_ERROR':
      case 'DATABASE_ERROR':
        err.status = 500;
        break;
      default:
        err.status = 400;
        break;
    }

    return err;
  }
}

export default Error;
