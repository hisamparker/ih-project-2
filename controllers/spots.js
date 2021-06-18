// Controllers are (typically) callback functions that correspond to routes (get, post, put, etc...). Controllers shrink the routes down and make them easier to read, they also keep code DRY.
const Spot = require(`../models/spot.model`);
const { DateTime } = require(`luxon`);
const { urlencoded } = require(`express`);
// To create a service client, import the service's factory function from '@mapbox/mapbox-sdk/services/{service}'
// provide it with your access token.
const geocodingClient = require(`@mapbox/mapbox-sdk/services/geocoding`);
const geocodingService = geocodingClient({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res, next) => {
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
    res.render(`spots/new`);
};

module.exports.createNewSpot = async (req, res, next) => {
    // get coordinates from mapbox api
    const geocodingResponse = await geocodingService
        .forwardGeocode({
            query: req.body.spot.location,
            limit: 1,
        })
        .send();
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
    // flash a success message before redirecting to the new spot
    req.flash(`success`, `You added a new cute spot, thanks!`);
    res.redirect(`/spots/${savedSpot.slug}/${savedSpot._id}`);
};

module.exports.renderEditSpotForm = async (req, res, next) => {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
        req.flash(`error`, `Sorry, spot not found.`);
        res.redirect(`/spots`);
    }
    res.render(`spots/edit`, { spot });
};

module.exports.editSpot = async (req, res, next) => {
    const { id } = req.params;
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
    await updatedSpot.save();
    req.flash(`success`, `You've made your spot even cuter!`);
    return res.redirect(`/spots/${updatedSpot.slug}/${updatedSpot._id}`);
};

module.exports.renderSelectedSpot = async (req, res, next) => {
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
    const resizeImageUrls = (spotObject) => {
        for (let i = 0; i < spotObject.images.length; i++) {
            const insertionPoint = `/upload/`;
            const desiredIndex = spotObject.images[i].url.lastIndexOf(insertionPoint) + insertionPoint.length;
            spotObject.images[i].url = [
                spotObject.images[i].url.slice(0, desiredIndex),
                `c_fill,h_400,w_600/`,
                spotObject.images[i].url.slice(desiredIndex),
            ].join(``);
        }
        return spotObject;
    };
    const newSpotObject = resizeImageUrls(spot);
    res.render(`spots/show`, { spot: newSpotObject, updatedAt: formattedUpdatedAt });
};

module.exports.destroySelectedSpot = async (req, res, next) => {
    const { id } = req.params;
    const deletedSpot = await Spot.findByIdAndDelete(id);
    req.flash(`success`, `${deletedSpot.name} was successfully deleted`);
    return res.redirect(`/spots`);
};
