// create an error class that extends the express error instance, accepts both an error message and a status code
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ErrorHandler;

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

// OTHER OPTION
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
