const { reviewSchema } = require(`../helpers/validationSchemas`);
const ErrorHandler = require(`../utils/ErrorHandlers`);

module.exports.validateReview = (req, res, next) => {
    // Destructure the result to just get the error
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // Joi error.details stores an array, so we need to map over it (in case there are more than 1) and then join the messages together on the comma
        const errorMessage = error.details.map((el) => el.message).join(`,`);
        throw new ErrorHandler(errorMessage, 400);
    } else {
        next();
    }
};
