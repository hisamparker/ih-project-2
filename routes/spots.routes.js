const express = require('express');
const router = express.Router();

const Spot = require('../models/spot.model');

router.get('/', async(req, res, next) => {
    const spots = await Spot.find({});
    res.render('spots/index', {spots});
});

module.exports = router;
