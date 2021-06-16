// provides methods and properties related to a user's session (session is stored server side, but session ID is stored in http cookie)
const session = require(`express-session`);
// MongoDB session store for Connect and Express written in Typescript. connect-mongo stores sessions in the "sessions" collection by default.
const MongoStore = require(`connect-mongo`)(session);
const dbUrl = process.env.MONGO_ATLAS_URL;

/* eslint-disable no-undef */
// use mongo store to store data in mongodb instead of memory, yay
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

module.exports = (app) => {
    // tell session to use the configs we've specified
    app.use(
        session({
            // config session use store to store data in mongodb instead of memory, yay
            store,
            secret: process.env.SESSION_SECRET,
            // false because saving in session store not local memory, using lazy resave from mongo store
            resave: false,
            saveUninitialized: true,
            cookie: {
                sameSite: true,
                // Thanks Syntax podcast on auth
                httpOnly: true,
                // Date.now is in milliseconds so convert it to expire in a day from date session started (current day in milliseconds + (1000 * 60[seconds in a min] * 60[mins in an hour] * 24[hours in a day] )
                expires: Date.now() + 1000 * 60 * 60 * 24,
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    );
};
/* eslint-enable no-undef */
