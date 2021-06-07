const Spot = require(`../models/spot.model`);

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    // https://mongoosejs.com/docs/api.html#document_Document-equals
    if (!spot.author.equals(req.user._id)) {
        req.flash(`error`, `Only the spot's author can make changes.`);
        return res.redirect(`/spots/${id}`);
    }
    next();
};
