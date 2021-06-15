if (process.env.NODE_ENV !== `production`) {
    require(`dotenv`).config();
}
// dependencies
const express = require(`express`);
const mongoose = require(`mongoose`);
const hbs = require(`hbs`);
// The path module provides functionality to access and interact with the file system (fs)
const path = require(`path`);
// with method override you can make your app RESTful by having descriptive http verbs like PUT PATCH and DELETE https://lo-victoria.com/a-deep-look-into-restful-apis
const methodOverride = require(`method-override`);
// The flash is a special area of the session used for storing messages https://www.npmjs.com/package/connect-flash
const flash = require(`connect-flash`);
// provides methods and properties related to a user's session (session is stored server side, but session ID is stored in http cookie)
const session = require(`express-session`);
// handling auth
const passport = require(`passport`);
// authenticate using a username and password
const LocalStrategy = require(`passport-local`);
const sanitizeMongo = require(`express-mongo-sanitize`);
// MongoDB session store for Connect and Express written in Typescript. connect-mongo stores sessions in the "sessions" collection by default.
const MongoStore = require(`connect-mongo`)(session);
// const dbUrl = `mongodb://localhost:27017/${process.env.DB_NAME}`;
const dbUrl = process.env.MONGO_ATLAS_URL;
// init a new mongo store for session data, it needs the db url and a password, with mongostore you create a collection with session id,
const store = new MongoStore({
    url: dbUrl,
    secret: process.env.MONGO_STORE_SECRET,
    // so you don't resave session on db every time user refreshes, instead limit a period of time - if nothing has changed, only update every 24 hours
    // in seconds not milliseconds like session, pffft
    touchAfter: 24 * 60 * 60,
});

// To handle errors after initial connection was established, you should listen for error events on the connection.
store.on(`error`, function (e) {
    console.log(`session store error`, e);
});

// local require
const spotRoutes = require(`./routes/spot.routes`);
const reviewRoutes = require(`./routes/review.routes`);
const userRoutes = require(`./routes/user.routes`);
// Error handling class for handling errors (send message and status)
const ErrorHandler = require(`./utils/ErrorHandlers`);
const User = require(`./models/user.model`);
require(`./configs/db.config`);

const app = express();

// set the view engine to hbs
app.set(`view engine`, `hbs`);
// provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set(`views`, path.join(__dirname, `views`));
// Path to the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, `views/partials`));
// register helper to compare values in hbs templates
hbs.registerHelper(`ifEquals`, function (a, b, opts) {
    if (a) {
        a = `${a}`;
    }
    if (b) {
        b = `${b}`;
    }
    if (a === b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});
// Check if values are not equal, return value if true
hbs.registerHelper(`ifNotEqual`, function (a, b, opts) {
    if (a) {
        a = `${a}`;
    }
    if (b) {
        b = `${b}`;
    }
    if (a !== b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

// increment value
hbs.registerHelper(`inc`, function (value, options) {
    return parseInt(value) + 1;
});

// use multiple comparators
hbs.registerHelper(`iff`, function (a, operator, b, opts) {
    let bool = false;
    if (a) {
        a = `${a}`;
    }
    if (b) {
        b = `${b}`;
    }
    switch (operator) {
        case `===`:
            bool = a === b;
            break;
        case `>`:
            bool = a > b;
            break;
        case `<`:
            bool = a < b;
            break;
        default:
            bool = a === b;
    }

    if (bool) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});

// add
hbs.registerHelper(`add`, function (value1, value2) {
    value1 = parseFloat(value1);
    value2 = parseFloat(value2);

    const result = value1 + value2;
    return result;
});

// capitalize all first letters (for names!)
hbs.registerHelper(`capitalizeFirstLetters`, function (input) {
    const stringifiedInput = `${input}`;
    const inputArray = stringifiedInput.split(` `);
    if (stringifiedInput.indexOf(` `) >= 0) {
        const capitalizedWords = inputArray.map((word) => word[0].toUpperCase() + word.slice(1)).join(` `);
        return capitalizedWords;
    }
    const capitalizedWord = stringifiedInput.charAt(0).toUpperCase() + stringifiedInput.slice(1);
    return capitalizedWord;
});

// capitalize only first letter (paragraphs)
hbs.registerHelper(`capitalizeFirstLetter`, function (input) {
    const stringifiedInput = `${input}`;
    const capitalizedInput = stringifiedInput.charAt(0).toUpperCase() + stringifiedInput.slice(1);
    return capitalizedInput;
});

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

// config session use store to store data in mongodb instead of memory, yay
const configSession = {
    store,
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
// tell app to use session, tell session to use the configs we've specified
app.use(session(configSession));
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
    console.log(`session`, req.session);
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
