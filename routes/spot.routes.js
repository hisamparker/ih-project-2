const { Router } = require('express');

const router = new Router();
const { DateTime } = require('luxon');
const { spotSchema } = require('../validationSchemas');

const Spot = require('../models/spot.model');
const ErrorHandler = require('../utils/ErrorHandlers');
const tryCatchWrapper = require('../utils/tryCatchWrapper');

// move into a middleware folder?
const validateSpot = (req, res, next) => {
    // Destructure the result to just get the error
    const { error } = spotSchema.validate(req.body);
    if (error) {
        // Joi error.details stores an array, so we need to map over it (in case there are more than 1) and then join the messages together on the comma
        const errorMessage = error.details.map((el) => el.message).join(',');
        throw new ErrorHandler(errorMessage, 400);
    } else {
        next();
    }
};

router.get(
    '/',
    tryCatchWrapper(async (req, res, next) => {
        const spots = await Spot.find({});
        res.render('spots/index', { spots });
    })
);

router.get('/new', (req, res, next) => {
    res.render('spots/new');
});

router.post(
    '/',
    validateSpot,
    tryCatchWrapper(async (req, res, next) => {
        const newSpot = new Spot(req.body.spot);
        await newSpot.save();
        res.redirect(`spots/${newSpot._id}`);
    })
);

router.get(
    '/:id/edit',
    tryCatchWrapper(async (req, res, next) => {
        const spot = await Spot.findById(req.params.id);
        if (!spot) {
            throw new ErrorHandler('Spot not found', 404);
        }
        res.render('spots/edit', { spot });
    })
);

router.put(
    '/:id/edit',
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
        res.redirect(`/spots/${updatedSpot._id}`);
    })
);

router.delete(
    '/:id/delete',
    tryCatchWrapper(async (req, res, next) => {
        const { id } = req.params;
        const deletedSpot = await Spot.findByIdAndDelete(id);
        res.redirect('/spots');
    })
);

// remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get(
    '/:id',
    tryCatchWrapper(async (req, res, next) => {
        const { id } = req.params;
        const spot = await Spot.findById(id).populate('reviews');
        if (!spot) {
            throw new ErrorHandler(`That spot doesn't exist, you can add it though!`, 404);
        }
        const updatedAt = spot.updated_at;
        const formattedUpdatedAt = DateTime.fromJSDate(updatedAt).toFormat('LLL dd yyyy');
        res.render('spots/show', { spot, updatedAt: formattedUpdatedAt });
    })
);

router.use((error, req, res, next) => {
    console.log(`Mongoose error name : ${error.name}`);
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        error.message = error.name;
    }
    next(error);
});

router.all('*', (req, res, next) => {
    next(new ErrorHandler('Page Not Found', 404));
});

router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'this is not good (-_-｡)';
    res.status(statusCode).render('error', { err });
});

module.exports = router;
