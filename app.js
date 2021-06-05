require(`dotenv`).config();

// dependencies
const express = require(`express`);
const mongoose = require(`mongoose`);
const hbs = require(`hbs`);
const path = require(`path`);
const methodOverride = require(`method-override`);
const flash = require(`connect-flash`);
const session = require(`express-session`);
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);

// create validation schemas!
const Joi = require(`joi`);

// local require
const spotRoutes = require(`./routes/spot.routes`);
const reviewRoutes = require(`./routes/review.routes`);
const userRoutes = require(`./routes/user.routes`);
const ErrorHandler = require(`./utils/ErrorHandlers`);
const User = require(`./models/user.model`);

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// assign value of mongoose connection to a var to make it easier to reuse
const db = mongoose.connection;
// bind console.error to the console object, then pass in a string to describe the location of the error (connection)
db.on(`error`, console.error.bind(console, `connection error:`));
// open the db!
db.once(`open`, () => {
    console.log(`Database: ${process.env.DB_NAME} connected`);
});

const app = express();

app.set(`view engine`, `hbs`);
// provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set(`views`, path.join(__dirname, `views`));
// Path to the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, `views/partials`));

// parse the data coming in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use method override so I can use all http verbs with express
app.use(methodOverride(`_method`));
// To serve static files such as images, CSS files, and JavaScript files. The root argument specifies the root directory from which to serve static assets.
// Static files are typically files such as scripts, CSS files, images, etc... that aren't server-generated, but must be sent to the browser when requested.
// Typically this is not done from local server as that's super slow
app.use(express.static(path.join(__dirname, `public`)));

const configSession = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Thanks Syntax podcast on auth
        httpOnly: true,
        // Date.now is in milliseconds so convert it to expire in a day from date session started (current day in milliseconds + (1000 * 60[seconds in a min] * 60[mins in an hour] * 24[hours in a day] )
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
    },
};
app.use(session(configSession));
app.use(flash());
app.use((req, res, next) => {
    // if flash.success has a value on the request object, use res.locals.success because of locals we don't have to pass the value to hbs templates because we always have access to success
    res.locals.success = req.flash(`success`);
    res.locals.error = req.flash(`error`);
    // move on to next middleware
    next();
});
// https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
app.use(passport.initialize());
// stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do/28994045#28994045
// for persistent login session (must be below app.use(session))
app.use(passport.session());
// use the local strategy we've required, and for that strategy use the method authenticate on the user model (this method comes from passport local strategy)
passport.use(new LocalStrategy(User.authenticate()));
// how to store user in session
passport.serializeUser(User.serializeUser());
// how to get user data out of session
passport.deserializeUser(User.deserializeUser());

app.get(`/`, (req, res, next) => {
    console.log(`(-_-｡)`);
    res.render(`home`);
});

// app.get(`/user`, async (req, res, next) => {
//     const user = new User({
//         email: `pickle@pickle.com`,
//         username: `meeeee`,
//     });
//     // helper to register a new user with a given password and checks if username is unique takes in a user object and password
//     const newUser = await User.register(user, `pickles`);
//     res.send(newUser);
// });

app.use(`/spots/:id/reviews`, reviewRoutes);
app.use(`/spots`, spotRoutes);
app.use(`/`, userRoutes);

app.all(`*`, (req, res, next) => {
    next(new ErrorHandler(`Page Not Found`, 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = `this is not good (-_-｡)`;
    res.status(statusCode).render(`error`, { err });
});

// app.use((err, req, res, next) => {
//   handleError(err, res);
// });

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});

module.exports = app;
