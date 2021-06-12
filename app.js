// if (process.env.NODE_ENV !== `production`) {
//     require(`dotenv`).config();
// }
// // dependencies

// const express = require(`express`);
// const mongoose = require(`mongoose`);
// const hbs = require(`hbs`);

// // register helper to compare values in hbs templates
// hbs.registerHelper(`ifEquals`, function (a, b, opts) {
//     if (a.toString() === b.toString()) {
//         return opts.fn(this);
//     }
//     return opts.inverse(this);
// });
// hbs.registerHelper(`iff`, function (a, operator, b, opts) {
//     let bool = false;
//     a.toString();
//     b.toString();
//     switch (operator) {
//         case `===`:
//             bool = a === b;
//             break;
//         case `!==`:
//             bool = a !== b;
//             break;
//         case `>`:
//             bool = a > b;
//             break;
//         case `<`:
//             bool = a < b;
//             break;
//         default:
//             bool = a === b;
//     }

//     if (bool) {
//         return opts.fn(this);
//     }
//     return opts.inverse(this);
// });

// hbs.registerHelper(`inc`, function (value, options) {
//     return parseInt(value) + 1;
// });

// const path = require(`path`);
// // with method override you can make your app RESTful by having descriptive http verbs like PUT PATCH and DELETE
// // https://lo-victoria.com/a-deep-look-into-restful-apis
// const methodOverride = require(`method-override`);
// const flash = require(`connect-flash`);
// const session = require(`express-session`);
// const passport = require(`passport`);
// const LocalStrategy = require(`passport-local`);
// const sanitizeMongo = require(`express-mongo-sanitize`);
// // const MongoStore = require(`connect-mongo`)(session);
// // change on deploy
// // const dbUrl = process.env.MONGO_ATLAS_URL || `mongodb://localhost:27017/${process.env.DB_NAME}`;
// const dbUrl = `mongodb://localhost:27017/${process.env.DB_NAME}`;

// // create validation schemas! could also use express-validator which comes with sanitize html?
// const Joi = require(`joi`);

// // local require
// const spotRoutes = require(`./routes/spot.routes`);
// const reviewRoutes = require(`./routes/review.routes`);
// const userRoutes = require(`./routes/user.routes`);
// const ErrorHandler = require(`./utils/ErrorHandlers`);
// const User = require(`./models/user.model`);

// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
// });

// // assign value of mongoose connection to a var to make it easier to reuse
// const db = mongoose.connection;
// // bind console.error to the console object, then pass in a string to describe the location of the error (connection)
// db.on(`error`, console.error.bind(console, `connection error:`));
// // open the db!
// db.once(`open`, () => {
//     console.log(`Database: ${process.env.DB_NAME} connected`);
// });

// const app = express();

// app.set(`view engine`, `hbs`);
// // provides path to views - we always want the file we're trying to access the view from to be able to reach views
// app.set(`views`, path.join(__dirname, `views`));
// // Path to the location for handlebars partials here:
// hbs.registerPartials(path.join(__dirname, `views/partials`));

// // parse the data coming in
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Use method override so I can use all http verbs with express
// app.use(methodOverride(`_method`));
// // To serve static files such as images, CSS files, and JavaScript files. The root argument specifies the root directory from which to serve static assets.
// // Static files are typically files such as scripts, CSS files, images, etc... that aren't server-generated, but must be sent to the browser when requested.
// // Typically this is not done from local server as that's super slow
// app.use(express.static(path.join(__dirname, `public`)));
// // use mongo sanitize to remove characters (like $) from the query string that are used for mongo database injection https://www.netsparker.com/blog/web-security/what-is-nosql-injection/
// app.use(sanitizeMongo());

// // const store = new MongoStore({
// //     url: dbUrl,
// //     secret: process.env.MONGO_STORE_SECRET,
// //     // so you don't resave session on db every time user refreshes, instead limit a period of time - if nothing has changed, only update every 24 hours
// //     touchAfter: 24 * 60 * 60,
// // });

// // store.on(`error`, function (e) {
// //     console.log(`session store error`, e);
// // });

// const configSession = {
//     // store,
//     // rename session from default because slightly more secure?
//     name: `charlie_mae`,
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         // Thanks Syntax podcast on auth
//         httpOnly: true,
//         // secure: true, TURN THIS ON ON DEPLOY!
//         // Date.now is in milliseconds so convert it to expire in a day from date session started (current day in milliseconds + (1000 * 60[seconds in a min] * 60[mins in an hour] * 24[hours in a day] )
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
// };
// app.use(session(configSession));
// app.use(flash());
// // https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
// app.use(passport.initialize());
// // stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do/28994045#28994045
// // for persistent login session (must be below app.use(session))
// app.use(passport.session());
// // use the local strategy we've required, and for that strategy use the method authenticate on the user model (this method comes from passport local strategy)
// passport.use(new LocalStrategy(User.authenticate()));
// // how to store user in session
// passport.serializeUser(User.serializeUser());
// // how to get user data out of session
// passport.deserializeUser(User.deserializeUser());
//     // passport adds a user object to the request object, res.locals makes content accessible to all templates, so now templates have access to session user
//     res.locals.sessionUser = req.user;
//     // if flash.success has a value on the request object, use res.locals.success because of locals we don't have to pass the value to hbs templates because we always have access to success
//     res.locals.success = req.flash(`success`);
//     res.locals.error = req.flash(`error`);
//     res.locals.info = req.flash(`info`);
//     // get access to mapbox token in hbs templates
//     res.locals.map = process.env.MAPBOX_TOKEN;
//     console.log(req.query);
//     // move on to next middleware
//     next();
// });

// app.use(`/spots/:id/reviews`, reviewRoutes);
// app.use(`/spots`, spotRoutes);
// app.use(`/`, userRoutes);

// app.get(`/`, (req, res, next) => {
//     console.log(`(-_-｡)`);
//     res.render(`home`);
// });

// app.all(`*`, (req, res, next) => {
//     next(new ErrorHandler(`Page Not Found`, 404));
// });

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = `this is not good (-_-｡)`;
//     res.status(statusCode).render(`error`, { err });
// });

// // app.use((err, req, res, next) => {
// //   handleError(err, res);
// // });

// app.listen(process.env.PORT, () => {
//     console.log(`listening on ${process.env.PORT}`);
// });

// module.exports = app;

if (process.env.NODE_ENV !== `production`) {
    require(`dotenv`).config();
}
// dependencies

const express = require(`express`);
const mongoose = require(`mongoose`);
const hbs = require(`hbs`);

const path = require(`path`);
// with method override you can make your app RESTful by having descriptive http verbs like PUT PATCH and DELETE
// https://lo-victoria.com/a-deep-look-into-restful-apis
const methodOverride = require(`method-override`);
const flash = require(`connect-flash`);
const session = require(`express-session`);
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const sanitizeMongo = require(`express-mongo-sanitize`);
const MongoStore = require(`connect-mongo`)(session);
// change on deploy
const dbUrl = process.env.MONGO_ATLAS_URL || `mongodb://localhost:27017/${process.env.DB_NAME}`;
const store = new MongoStore({
    url: dbUrl,
    secret: process.env.MONGO_STORE_SECRET,
    // so you don't resave session on db every time user refreshes, instead limit a period of time - if nothing has changed, only update every 24 hours
    // in seconds not milliseconds like session, pffft
    touchAfter: 24 * 60 * 60,
});

store.on(`error`, function (e) {
    console.log(`session store error`, e);
});

// create validation schemas!
const Joi = require(`joi`);

// local require
const spotRoutes = require(`./routes/spot.routes`);
const reviewRoutes = require(`./routes/review.routes`);
const userRoutes = require(`./routes/user.routes`);
const ErrorHandler = require(`./utils/ErrorHandlers`);
const User = require(`./models/user.model`);

const app = express();

require(`./configs/db.config`);

app.set(`view engine`, `hbs`);
// provides path to views - we always want the file we're trying to access the view from to be able to reach views
app.set(`views`, path.join(__dirname, `views`));
// Path to the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, `views/partials`));
// register helper to compare values in hbs templates
hbs.registerHelper(`ifEquals`, function (a, b, opts) {
    if (a) {
        a.toString();
    }
    if (b) {
        b.toString();
    }
    if (a === b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});
hbs.registerHelper(`ifNotEqual`, function (a, b, opts) {
    if (a) {
        a.toString();
    }
    if (b) {
        b.toString();
    }
    if (a !== b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
});
hbs.registerHelper(`iff`, function (a, operator, b, opts) {
    let bool = false;
    if (a) {
        a.toString();
    }
    if (b) {
        b.toString();
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

hbs.registerHelper(`inc`, function (value, options) {
    return parseInt(value) + 1;
});

// parse the data coming in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use method override so I can use all http verbs with express
app.use(methodOverride(`_method`));
// To serve static files such as images, CSS files, and JavaScript files. The root argument specifies the root directory from which to serve static assets.
// Static files are typically files such as scripts, CSS files, images, etc... that aren't server-generated, but must be sent to the browser when requested.
// Typically this is not done from local server as that's super slow
app.use(express.static(path.join(__dirname, `public`)));
// use mongo sanitize to remove characters (like $) from the query string that are used for mongo database injection https://www.netsparker.com/blog/web-security/what-is-nosql-injection/
app.use(sanitizeMongo());

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
app.use(session(configSession));
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

app.use(`/spots/:id/reviews`, reviewRoutes);
app.use(`/spots`, spotRoutes);
app.use(`/`, userRoutes);

app.get(`/`, (req, res, next) => {
    console.log(`(-_-｡)`);
    res.render(`home`);
});

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

module.exports = app;
