const { Router } = require(`express`);
const router = new Router({ mergeParams: true });
const passport = require(`passport`);

const User = require(`../models/user.model`);
const isLoggedIn = require(`../middleware/isLoggedIn`);

router.get(`/signup`, (req, res, next) => {
    res.render(`users/signup`);
});

router.post(`/signup`, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        // helper to register a new user with a given password and checks if username is unique takes in a user object and password
        const registeredUser = await User.register(newUser, password);
        // passport adds a login method to the request object, this method does not support async await so you need to use a callback and pass any errors into next()
        req.login(registeredUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash(`success`, `Hi ${newUser.username}, welcome to cute spot!`);
            res.redirect(`/spots`);
        });
    } catch (e) {
        // the error message comes from passport local mongoose because they ensure that username is unique
        req.flash(`error`, e.message);
        res.redirect(`/signup`);
        next(e);
    }
});

router.get(`/login`, (req, res, next) => {
    res.render(`users/login`);
});

router.post(
    `/login`,
    // passport provides a middleware called passport.authenticate, it expects a strategy and
    // you can pass in options like a failure flash and a failure redirect
    passport.authenticate(`local`, { failureFlash: true, failureRedirect: `/login` }),
    (req, res, next) => {
        const { username } = req.body;
        req.flash(`success`, `Hey, ${username}, welcome back!`);
        // instead of redirecting user to list page, redirect them to where they originally wanted to go.
        // their desired path is stored on the session object now (look at isLoggedIn middleware to see how) so if it's defined, desiredPath = their originalUrl, otherwise, it's equal to the list route
        const desiredPath = req.session.originalUrl || `/spots`;
        return res.redirect(desiredPath);
    }
);

router.get(`/logout`, (req, res) => {
    req.logout();
    req.flash(`success`, `Have a good one!`);
    return res.redirect(`/`);
});

module.exports = router;
