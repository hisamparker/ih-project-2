const Review = require(`../models/review.model`);

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // https://mongoosejs.com/docs/api.html#document_Document-equals
    if (!review.author.equals(req.user._id)) {
        req.flash(`error`, `Only the review's author can make changes.`);
        return res.redirect(`/spots/${id}`);
    }
    next();
};
