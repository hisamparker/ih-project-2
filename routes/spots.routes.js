const { Router } = require('express');
const router = new Router();
const { DateTime } = require('luxon');

const Spot = require('../models/spot.model');
const ErrorHandler = require("../utils/errors");

router.get('/', async (req, res, next) => {
  const spots = await Spot.find({});
  res.render('spots/index', { spots });
});

router.get('/new', (req, res, next) => {
  res.render('spots/new');
});

router.post('/new', async (req, res, next) => {
    const {name, location, image, description} = req.body;
    const newSpot = new Spot({name, location, image, description});
    await newSpot.save();
    res.redirect(`${newSpot._id}`);
});

router.get('/:id/edit', async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  res.render('spots/edit', { spot });
});

router.put('/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    const { name, location, image, description } = req.body;
    const updatedSpot = await Spot.findByIdAndUpdate(id, {
      name,
      location,
      description,
    });
    await updatedSpot.save();
    res.redirect(`/spots/${updatedSpot._id}`);
});

router.delete('/:id/delete', async (req, res, next) => {
    const { id } = req.params;
    const deletedSpot = await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
});

//remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        const spot = await Spot.findById(id);
        console.log(spot)
        if (!spot) {
            console.log('OOOPSPFAPPFPAPFDPAF')
            next(new ErrorHandler(`That spot doesn't exist, you can add it though!`, 404));
            res.redirect("spots/new");
        }
        const updatedAt = spot.updated_at;
        const formattedUpdatedAt = DateTime.fromJSDate(updatedAt).toFormat("LLL dd yyyy");
        res.render("spots/show", { spot, updatedAt: formattedUpdatedAt });
    } catch (e) {
        next(e);
    }
});

router.use((err, req, res, next) => {
  const { status = 500, message = "this is not good (-_-｡)" } = err;
  res.status(status).send(message);
});


module.exports = router;
