const { Router } = require(`express`);
const router = new Router({ mergeParams: true });
const passport = require(`passport`);

const User = require(`../models/user.model`);

router.get(`/signup`, (req, res, next) => {
    res.render(`users/signup`);
});

router.post(`/signup`, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        // helper to register a new user with a given password and checks if username is unique takes in a user object and password
        const registeredUser = await User.register(newUser, password);
        req.flash(`success`, `Hi ${newUser.username}, welcome to cute spot!`);
        res.redirect(`/spots`);
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
        res.redirect(`/spots`);
    }
);

module.exports = router;
