const { Router } = require(`express`);

// Routes all get separate params, but I want to get spot._id from the spot route params, so I set mergeParams to true
const router = new Router({ mergeParams: true });
const { reviewSchema } = require(`../validationSchemas`);

const Spot = require(`../models/spot.model`);
const Review = require(`../models/review.model`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);
const { isLoggedIn } = require(`../middleware/isLoggedIn`);
const { validateReview } = require(`../middleware/validateReview`);
const { isReviewAuthor } = require(`../middleware/isReviewAuthor`);

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

// review route has both review id and spot id so info for the spot that the review is on is available... can pre-populate form with info from the review id, author will not change because only author can edit
router.get(
    `/:reviewId/edit`,
    isLoggedIn,
    isReviewAuthor,
    tryCatchWrapper(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash(`error`, `Sorry, review not found.`);
            res.redirect(`/spots/${id}`);
        }
        res.render(`reviews/edit`, { review, spotId: id });
    })
);

router.put(
    `/:reviewId/edit`,
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    tryCatchWrapper(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { ...req.body.review },
            // make sure to validate with schema on update
            { runValidators: true }
        );
        await updatedReview.save();
        req.flash(`success`, `You've successfully updated your review!`);
        return res.redirect(`/spots/${id}`);
    })
);

router.delete(
    `/:reviewId`,
    isLoggedIn,
    isReviewAuthor,
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
