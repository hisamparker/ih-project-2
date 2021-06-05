// router object, to separate out routes so they're not all in app
const { Router } = require(`express`);

const router = new Router();
const { DateTime } = require(`luxon`);
const { spotSchema } = require(`../validationSchemas`);
const passport = require(`passport`);

const Spot = require(`../models/spot.model`);
const ErrorHandler = require(`../utils/ErrorHandlers`);
const tryCatchWrapper = require(`../utils/tryCatchWrapper`);
const { isLoggedIn } = require(`../middlewares/isLoggedIn`);

// move into a middleware folder?
const validateSpot = (req, res, next) => {
    // Destructure the result to just get the error
    const { error } = spotSchema.validate(req.body);
    if (error) {
        // Joi error.details stores an array, so we need to map over it (in case there are more than 1) and then join the messages together on the comma
        const errorMessage = error.details.map((el) => el.message).join(`,`);
        throw new ErrorHandler(errorMessage, 400);
    } else {
        next();
    }
};

router.get(
    `/`,
    tryCatchWrapper(async (req, res, next) => {
        const spots = await Spot.find({});
        res.render(`spots/index`, { spots });
    })
);

router.get(`/new`, isLoggedIn, (req, res, next) => {
    res.render(`spots/new`);
});

router.post(
    `/`,
    validateSpot,
    tryCatchWrapper(async (req, res, next) => {
        const newSpot = new Spot(req.body.spot);
        await newSpot.save();
        // flash a success message before redirecting to the new spot
        req.flash(`success`, `You added a new cute spot, thanks!`);
        res.redirect(`spots/${newSpot._id}`);
    })
);

router.get(
    `/:id/edit`,
    tryCatchWrapper(async (req, res, next) => {
        const spot = await Spot.findById(req.params.id);
        if (!spot) {
            req.flash(`error`, `Sorry, spot not found.`);
            res.redirect(`/spots`);
        }
        res.render(`spots/edit`, { spot });
    })
);

router.put(
    `/:id/edit`,
    validateSpot,
    tryCatchWrapper(async (req, res, next) => {
        const { id } = req.params;
        console.log(req.body);
        const updatedSpot = await Spot.findByIdAndUpdate(
            id,
            { ...req.body.spot },
            // make sure to validate with schema on update
            { runValidators: true }
        );
        await updatedSpot.save();
        req.flash(`success`, `You've made your spot even cuter!`);
        res.redirect(`/spots/${updatedSpot._id}`);
    })
);

// remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get(
    `/:id`,
    tryCatchWrapper(async (req, res, next) => {
        const { id } = req.params;
        const spot = await Spot.findById(id).populate(`reviews`);
        if (!spot) {
            req.flash(`error`, `Sorry, spot not found.`);
            res.redirect(`/spots`);
        }
        const updatedAt = spot.updated_at;
        const formattedUpdatedAt = DateTime.fromJSDate(updatedAt).toFormat(`LLL dd yyyy`);
        res.render(`spots/show`, { spot, updatedAt: formattedUpdatedAt });
    })
);

router.delete(
    `/:id/delete`,
    tryCatchWrapper(async (req, res, next) => {
        const { id } = req.params;
        const deletedSpot = await Spot.findByIdAndDelete(id);
        req.flash(`success`, `${deletedSpot.name} was successfully deleted`);
        res.redirect(`/spots`);
    })
);

// router.use((error, req, res, next) => {
//     console.log(`Mongoose error name : ${error.name}`);
//     if (error.name === `ValidationError` || error.name === `CastError`) {
//         error.message = error.name;
//     }
//     next(error);
// });

module.exports = router;
