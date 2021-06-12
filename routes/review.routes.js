const { Router } = require(`express`);
// Routes all get separate params, but I want to get spot._id from the spot route params, so I set mergeParams to true
const router = new Router({ mergeParams: true });

const { reviewSchema } = require(`../helpers/validationSchemas`);
const Review = require(`../models/review.model`);
const reviews = require(`../controllers/reviews`);
const Spot = require(`../models/spot.model`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);
const { isLoggedIn } = require(`../middleware/isLoggedIn`);
const { validateReview } = require(`../middleware/validateReview`);
const { isReviewAuthor } = require(`../middleware/isReviewAuthor`);

router.post(`/`, isLoggedIn, validateReview, tryCatchWrapper(reviews.createNewReview));

// review route has both review id and spot id so info for the spot that the review is on is available... can pre-populate form with info from the review id, author will not change because only author can edit
router.get(`/:reviewId/edit`, isLoggedIn, isReviewAuthor, tryCatchWrapper(reviews.renderEditReviewForm));

router.put(`/:reviewId/edit`, isLoggedIn, isReviewAuthor, validateReview, tryCatchWrapper(reviews.editReview));

router.delete(`/:reviewId`, isLoggedIn, isReviewAuthor, tryCatchWrapper(reviews.destroyReview));

module.exports = router;
