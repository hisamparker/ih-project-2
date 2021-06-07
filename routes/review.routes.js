const { Router } = require(`express`);

// Routes all get separate params, but I want to get spot._id from the spot route params, so I set mergeParams to true
const router = new Router({ mergeParams: true });
const { reviewSchema } = require(`../validationSchemas`);

const Spot = require(`../models/spot.model`);
const Review = require(`../models/review.model`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);
const { isLoggedIn } = require(`../middleware/isLoggedIn`);
const { validateReview } = require(`../middleware/validateReview`);

router.post(
    `/`,
    isLoggedIn,
    validateReview,
    tryCatchWrapper(async (req, res, next) => {
        // console.log(`body: ${JSON.stringify(req.body)}, params : ${JSON.stringify(req.params)}`);
        const reviewedSpot = await Spot.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        reviewedSpot.reviews.push(review);
        await review.save();
        await reviewedSpot.save();
        req.flash(`success`, `Thanks for reviewing ${reviewedSpot.name}`);
        return res.redirect(`/spots/${reviewedSpot._id}`);
    })
);

router.delete(
    `/:reviewId`,
    isLoggedIn,
    tryCatchWrapper(async (req, res, next) => {
        const { id, reviewId } = req.params;
        // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        const spotWithDeletedReview = await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash(`success`, `Your review of ${spotWithDeletedReview.name} was deleted.`);
        return res.redirect(`/spots/${id}`);
    })
);

module.exports = router;
