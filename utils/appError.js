const { Error } = require('mongoose');

// AppError inherits from Error.
class AppError extends Error {
  // The things that are gonna be inherited is in the cunstructor aurgments :
  constructor(message, statusCode) {
    // We call super in order to call the parent constructor.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // https://medium.com/@SigniorGratiano/express-error-handling-674bfdd86139
    // Programming errors : are bugs that developers introduce into the code.
    // Operational errors : on the other hand, are things that will inevitably happen when people interact with our app.

    Error.captureStackTrace(this, this.construct);
    // the captureStackTrace line prevents this class from showing up in the stack trace, which is part of the console log that shows where in code the error occurred.
  }
}

module.exports = AppError;
