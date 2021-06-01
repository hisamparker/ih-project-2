const { Router } = require('express');
const router = new Router();
const { DateTime } = require('luxon');

const Spot = require('../models/spot.model');

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
    console.log(newSpot)
    res.redirect(`${newSpot._id}`);
});

router.get('/:id/edit', async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  console.log(spot)
  res.render('spots/edit', { spot });
});

router.put('/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    const { name, location, image, description } = req.body;
    console.log(name, location, image, description)
    console.log(req.body)
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
    console.log(deletedSpot);
    res.redirect('/spots');
});

//remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    const updatedAt = spot.updated_at;
    const formattedUpdatedAt = DateTime.fromJSDate(updatedAt).toFormat('yyyy LLL dd');
    // const updatedAt = spot.updated_at.toString();
    // console.log(updatedAt, typeof updatedAt);
    // const formattedUpdatedAt = updatedAt.split(" ");
    // formattedUpdatedAt.slice(4);
    console.log(formattedUpdatedAt);
    res.render("spots/show", { spot, updatedAt: formattedUpdatedAt });
});


module.exports = router;
