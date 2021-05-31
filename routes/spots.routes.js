const { Router } = require("express");
const router = new Router();

const Spot = require("../models/spot.model");

router.get("/", async (req, res, next) => {
  const spots = await Spot.find({});
  res.render("spots/index", { spots });
});

router.get("/new", (req, res, next) => {
  res.render("spots/new");
});

router.post("/new", async (req, res, next) => {
    const {name, location, description} = req.body;
    const newSpot = new Spot({name, location, description});
    await newSpot.save();
    console.log(newSpot)
    res.redirect(`${newSpot._id}`);
});

//remember to put other routes prefixed by / before this route or their will be a load error because what's after the route will be read by the client as an id
router.get("/:id", async (req, res, next) => {
  const spot = await Spot.findById(req.params.id);
  res.render("spots/show", { spot });
});

module.exports = router;
