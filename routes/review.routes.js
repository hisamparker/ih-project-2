const { Router } = require(`express`);

const router = new Router();
const { reviewSchema } = require(`../validationSchemas`);

const Spot = require(`../models/spot.model`);
const Review = require(`../models/review.model`);
const ErrorHandler = require(`../utils/ErrorHandlers`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);

// move into a middleware folder?
const validateReview = (req, res, next) => {
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

router.post(
    `/:id`,
    validateReview,
    tryCatchWrapper(async (req, res, next) => {
        const reviewedSpot = await Spot.findById(req.params.id);
        const review = new Review(req.body.review);
        reviewedSpot.reviews.push(review);
        await review.save();
        await reviewedSpot.save();
        res.redirect(`/spots/${reviewedSpot._id}`);
    })
);

router.delete(
    `/:reviewId/:id`,
    tryCatchWrapper(async (req, res, next) => {
        const { id, reviewId } = req.params;
        // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/spots/${id}`);
    })
);

module.exports = router;
