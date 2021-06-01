class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ErrorHandler;

// class ErrorHandler extends Error {
//   constructor(statusCode, message) {
//     super();
//     this.statusCode = statusCode;
//     this.message = message;
//   }
// }

// const handleError = (err, res) => {
//   const { statusCode, message } = err;
//   res.status(statusCode).json({
//     status: "error",
//     statusCode,
//     message,
//   });
// };

// module.exports = {
//   ErrorHandler,
//   handleError,
// };

//OTHER OPTION
// class ErrorHandler extends Error {
//   constructor(message, statusCode) {
//     super(message);

//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
//     this.isOperational = true;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// app.all("*", (req, res, next) => {
//   next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
// });
