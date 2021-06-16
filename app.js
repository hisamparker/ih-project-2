if (process.env.NODE_ENV !== `production`) {
    require(`dotenv`).config();
}
// dependencies
const express = require(`express`);
// const mongoose = require(`mongoose`);
const hbs = require(`hbs`);
// The path module provides functionality to access and interact with the file system (fs)
const path = require(`path`);
const favicon = require(`serve-favicon`);
// with method override you can make your app RESTful by having descriptive http verbs like PUT PATCH and DELETE https://lo-victoria.com/a-deep-look-into-restful-apis
const methodOverride = require(`method-override`);
// The flash is a special area of the session used for storing messages https://www.npmjs.com/package/connect-flash
const flash = require(`connect-flash`);
// handling auth
const passport = require(`passport`);
// authenticate using a username and password
const LocalStrategy = require(`passport-local`);
const sanitizeMongo = require(`express-mongo-sanitize`);

// local requires
const spotRoutes = require(`./routes/spot.routes`);
const reviewRoutes = require(`./routes/review.routes`);
const userRoutes = require(`./routes/user.routes`);
const User = require(`./models/user.model`);
// Error handling class for handling errors (send message and status)
const ErrorHandler = require(`./utils/ErrorHandlers`);

// init appy app
const app = express();

// require db and session configs
require(`./configs/db.config`);
require(`./configs/session.config`)(app);

app.use(favicon(path.join(__dirname, `public`, `images/favicon.ico`)));
// set the view engine to hbs
app.set(`view engine`, `hbs`);
// provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set(`views`, path.join(__dirname, `views`));
// Path to the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, `views/partials`));
// require helpers file
const helpers = require(`./helpers/hbsHelpers.js`);
// register all helpers
hbs.registerHelper(helpers);

// parse url encoded data (form data)
app.use(express.urlencoded({ extended: true }));
// parse json data
app.use(express.json());
// Use method override so I can use all http verbs with express
app.use(methodOverride(`_method`));
// To serve static files such as images, CSS files, and JavaScript files. The root argument specifies the root directory from which to serve static assets.
// Static files are typically files such as scripts, CSS files, images, etc... that aren't server-generated, but must be sent to the browser when requested.
// Typically this is not done from local server as that's super slow
app.use(express.static(path.join(__dirname, `public`)));
// use mongo sanitize to remove characters (like $) from the query string that are used for mongo database injection https://www.netsparker.com/blog/web-security/what-is-nosql-injection/
app.use(sanitizeMongo());

// tell app to use flash, yay
app.use(flash());
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
// tell app to use our locals so we can access stuff
app.use((req, res, next) => {
    // passport adds a user object to the request object, res.locals makes content accessible to all templates, so now templates have access to session user
    res.locals.sessionUser = req.user;
    // if flash.success has a value on the request object, use res.locals.success because of locals we don't have to pass the value to hbs templates because we always have access to success
    res.locals.success = req.flash(`success`);
    res.locals.error = req.flash(`error`);
    res.locals.info = req.flash(`info`);
    // get access to mapbox token in hbs templates
    res.locals.map = process.env.MAPBOX_TOKEN;
    console.log(req.query);
    // move on to next middleware
    next();
});

// routes
app.use(`/spots/:slug/:id/reviews`, reviewRoutes);
app.use(`/spots`, spotRoutes);
app.use(`/`, userRoutes);

app.get(`/`, (req, res, next) => {
    console.log(`(-_-｡)`);
    res.render(`home`);
});

// express doesn't treat 404s as errors, so we say for everything that happens, if there's a prob, create a new instance of the error class and pass in a page not found message and a 404 status code
app.all(`*`, (req, res, next) => {
    next(new ErrorHandler(`Page Not Found`, 404));
});

// generic error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = `this is not good (-_-｡)`;
    res.status(statusCode).render(`error`, { err });
});

// PORT is so heroku can determine the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

module.exports = app;
