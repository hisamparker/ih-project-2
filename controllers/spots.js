// Controllers are (typically) callback functions that correspond to routes (get, post, put, etc...). Controllers shrink the routes down and make them easier to read, they also keep code DRY.
const { DateTime } = require(`luxon`);
const { urlencoded } = require(`express`);
// To create a service client, import the service's factory function from '@mapbox/mapbox-sdk/services/{service}'
// provide it with your access token.
const geocodingClient = require(`@mapbox/mapbox-sdk/services/geocoding`);
const geocodingService = geocodingClient({ accessToken: process.env.MAPBOX_TOKEN });
// Local require
const Spot = require(`../models/spot.model`);

module.exports.index = async (req, res, next) => {
    req.session.originalUrl = req.originalUrl;
    const spots = await Spot.find({});
    spots.forEach((spot) => {
        const insertionPoint = `/upload/`;
        const desiredIndex = spot.images[0].url.lastIndexOf(insertionPoint) + insertionPoint.length;
        spot.images[0].url = [
            spot.images[0].url.slice(0, desiredIndex),
            `c_fill,h_275,w_415/`,
            spot.images[0].url.slice(desiredIndex),
        ].join(``);
    });
    res.render(`spots/index`, { spots });
};

module.exports.renderNewSpotForm = (req, res, next) => {
    req.session.originalUrl = req.originalUrl;
    res.render(`spots/new`);
};

module.exports.createNewSpot = async (req, res, next) => {
    // get coordinates from mapbox api ??? Maybe this could be a helper?
    const geocodingResponse = await geocodingService
        .forwardGeocode({
            query: req.body.spot.location,
            limit: 1,
        })
        .send();
    // not an ideal solution, don't know how to stop submit form and just flash message?
    if (!geocodingResponse.body.features[0]) {
        req.flash(`error`, `Please enter a valid location.`);
        const desiredPath = req.session.originalUrl;
        delete req.session.originalUrl;
        return res.redirect(desiredPath);
    }
    // this returns geoJSON
    const spotGeometry = geocodingResponse.body.features[0].geometry;
    const newSpot = new Spot(req.body.spot);
    newSpot.geometry = spotGeometry;
    // map any uploaded files into an object
    newSpot.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    newSpot.author = req.user._id;
    const savedSpot = await newSpot.save();
    if (!savedSpot) {
        req.flash(`error`, `Spot not added, please try again.`);
        return res.redirect(`/new`);
    }
    delete req.session.originalUrl;
    // flash a success message before redirecting to the new spot
    req.flash(`success`, `You added a new cute spot, thanks!`);
    res.redirect(`/spots/${savedSpot.slug}/${savedSpot._id}`);
};

module.exports.renderEditSpotForm = async (req, res, next) => {
    req.session.originalUrl = req.originalUrl;
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
        req.flash(`error`, `Sorry, spot not found.`);
        res.redirect(`/spots`);
    }
    res.render(`spots/edit`, { spot });
};

module.exports.editSpot = async (req, res, next) => {
    // get coordinates from mapbox api
    const geocodingResponse = await geocodingService
        .forwardGeocode({
            query: req.body.spot.location,
            limit: 1,
        })
        .send();
    // this returns geoJSON
    const { id } = req.params;
    if (!geocodingResponse.body.features[0]) {
        req.flash(`error`, `Please enter a valid location.`);
        const desiredPath = req.session.originalUrl;
        delete req.session.originalUrl;
        return res.redirect(desiredPath);
    }
    const spotGeometry = geocodingResponse.body.features[0].geometry;
    const updatedSpot = await Spot.findByIdAndUpdate(
        id,
        { ...req.body.spot },
        // make sure to validate with schema on update
        { runValidators: true }
    );
    // create a new array from any images added during edit
    const newImages = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    // spread the new images and push them onto updatedSpot.images
    updatedSpot.images.push(...newImages);
    updatedSpot.geometry = spotGeometry;
    await updatedSpot.save();
    req.flash(`success`, `You've made your spot even cuter!`);
    return res.redirect(`/spots/${updatedSpot.slug}/${updatedSpot._id}`);
};

module.exports.renderSelectedSpot = async (req, res, next) => {
    req.session.originalUrl = req.originalUrl;
    const { id } = req.params;
    // populate reviews to get all info on reviews, populate author to get details of spot author, can now access spot.author.username
    const spot = await Spot.findById(id)
        .populate({
            path: `reviews`,
            populate: {
                path: `author`,
            },
        })
        .populate(`author`);
    if (!spot) {
        req.flash(`error`, `Sorry, spot not found.`);
        return res.redirect(`/spots`);
    }
    const updatedAt = spot.updated_at;
    const formattedUpdatedAt = DateTime.fromJSDate(updatedAt).toFormat(`LLL dd yyyy`);
    for (const image of spot.images) {
        const insertionPoint = `/upload/`;
        const desiredIndex = image.url.lastIndexOf(insertionPoint) + insertionPoint.length;
        image.url = [image.url.slice(0, desiredIndex), `c_fill,h_400,w_600/`, image.url.slice(desiredIndex)].join(``);
    }
    res.render(`spots/show`, { spot, updatedAt: formattedUpdatedAt });
};

module.exports.destroySelectedSpot = async (req, res, next) => {
    const { id } = req.params;
    const deletedSpot = await Spot.findByIdAndDelete(id);
    req.flash(`success`, `${deletedSpot.name} was successfully deleted`);
    return res.redirect(`/spots`);
};
