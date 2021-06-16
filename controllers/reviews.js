const Spot = require(`../models/spot.model`);
const Review = require(`../models/review.model`);

module.exports.createNewReview = async (req, res, next) => {
    // console.log(`body: ${JSON.stringify(req.body)}, params : ${JSON.stringify(req.params)}`);
    const reviewedSpot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    reviewedSpot.reviews.push(review);
    await review.save();
    await reviewedSpot.save();
    req.flash(`success`, `Thanks for reviewing ${reviewedSpot.name}`);
    return res.redirect(`/spots/${reviewedSpot.slug}/${reviewedSpot._id}`);
};

module.exports.renderEditReviewForm = async (req, res, next) => {
    const { slug, id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash(`error`, `Sorry, review not found.`);
        res.redirect(`/spots/${slug}/${id}`);
    }
    res.render(`reviews/edit`, { slug, review, spotId: id });
};

module.exports.editReview = async (req, res, next) => {
    const { slug, id, reviewId } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { ...req.body.review },
        // make sure to validate with schema on update
        { runValidators: true }
    );
    await updatedReview.save();
    req.flash(`success`, `You've successfully updated your review!`);
    return res.redirect(`/spots/${slug}/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
    const { slug, id, reviewId } = req.params;
    // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    const spotWithDeletedReview = await Spot.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash(`success`, `Your review of ${spotWithDeletedReview.name} was deleted.`);
    return res.redirect(`/spots/${slug}/${id}`);
};
