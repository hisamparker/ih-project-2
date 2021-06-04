require('dotenv').config();

// dependencies
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const methodOverride = require('method-override');
// create validation schemas!
const Joi = require('joi');

// local require
const spotRoutes = require('./routes/spot.routes');
const reviewRoutes = require('./routes/review.routes');
const ErrorHandler = require('./utils/ErrorHandlers');

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// assign value of mongoose connection to a var to make it easier to reuse
const db = mongoose.connection;
// bind console.error to the console object, then pass in a string to describe the location of the error (connection)
db.on('error', console.error.bind(console, 'connection error:'));
// open the db!
db.once('open', () => {
    console.log(`Database: ${process.env.DB_NAME} connected`);
});

const app = express();

app.set('view engine', 'hbs');
// provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set('views', path.join(__dirname, 'views'));
// Path to the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// parse the data coming in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    console.log('(-_-｡)');
    res.render('home');
});

app.use('/spots', spotRoutes);
app.use('/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new ErrorHandler('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'this is not good (-_-｡)';
    res.status(statusCode).render('error', { err });
});

// app.use((err, req, res, next) => {
//   handleError(err, res);
// });

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});

module.exports = app;
