const { Router } = require('express');
const router = new Router();

const Spot = require('../models/spot.model');

router.get('/', async (req, res, next) => {
  const spots = await Spot.find({});
  res.render('spots/index', { spots });
});

router.get('/new', (req, res, next) => {
  res.render('spots/new');
});

router.post('/new', async (req, res, next) => {
    const {name, location, description} = req.body;
    const newSpot = new Spot({name, location, description});
    await newSpot.save();
    console.log(newSpot)
    res.redirect(`${newSpot._id}`);
});

router.get('/:id/edit', async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  res.render('spots/edit', { spot });
});

router.put('/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    const { name, location, description } = req.body;
    console.log(name, location, description)
    const updatedSpot = await Spot.findByIdAndUpdate(id, {
      name,
      location,
      description,
    });
    await updatedSpot.save();
    res.redirect(`/spots/${updatedSpot._id}`);
});

//remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get('/:id', async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  res.render('spots/show', { spot });
});


module.exports = router;
