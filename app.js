require('dotenv').config();

//dependencies
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');

//local require
const Spot = require('./models/spot.model');
const spotRoutes = require('./routes/spots.routes');

mongoose.connect(
    `mongodb://localhost:27017/${process.env.DB_NAME}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Database: ${process.env.DB_NAME} connected`);
});

const app = express();

app.set('view engine', 'hbs');
//provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/spot', async(req, res, next) => {
    const spot = new Spot({name: 'koffie & ik'})
    await spot.save();
    res.send(spot);
});

app.use("/spots", spotRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
