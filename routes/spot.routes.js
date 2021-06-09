// router object, to separate out routes so they're not all in app
const { Router } = require(`express`);
const router = new Router();

const Spot = require(`../models/spot.model`);
// spots object that represents spots controllers, has access to all spot controller methods on it.
const spots = require(`../controllers/spots`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);
const { isLoggedIn } = require(`../middleware/isLoggedIn`);
const { isAuthor } = require(`../middleware/isAuthor`);
const { validateSpot } = require(`../middleware/validateSpot`);
const fileUpload = require(`../configs/cloudinary.config`);

// pass spots.index into get route and I can access everything from the spots controller for index! This is amazing!
router.get(`/`, tryCatchWrapper(spots.index));

// try to name controller methods in a really clear way so that I know exactly what they're doing... These are much longer than other people seem to make them, but I think that's ok, ask Michael
router.get(`/new`, isLoggedIn, spots.renderNewSpotForm);

// should I move my async wrapper into the controller? Ask Michael
router.post(`/`, isLoggedIn, fileUpload.array(`image`), validateSpot, tryCatchWrapper(spots.createNewSpot));

router.get(`/:id/edit`, isLoggedIn, isAuthor, tryCatchWrapper(spots.renderEditSpotForm));

router.put(`/:id/edit`, isLoggedIn, isAuthor, fileUpload.array(`image`), validateSpot, tryCatchWrapper(spots.editSpot));

// remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get(`/:id`, tryCatchWrapper(spots.renderSelectedSpot));

// path, check if logged in, then check if author, then handle promises, then callbacks for deleting/destroying!
router.delete(`/:id/delete`, isLoggedIn, isAuthor, tryCatchWrapper(spots.destroySelectedSpot));

module.exports = router;
