const { Router } = require(`express`);
const router = new Router({ mergeParams: true });
const passport = require(`passport`);
const User = require(`../models/user.model`);
const auth = require(`../controllers/auth`);

router.get(`/signup`, auth.renderSignupForm);

router.post(`/signup`, auth.signupNewUser);

router.get(`/login`, auth.renderLoginForm);

router.post(
    `/login`,
    // passport provides a middleware called passport.authenticate, it expects a strategy and
    // you can pass in options like a failure flash and a failure redirect
    passport.authenticate(`local`, {
        failureFlash: true,
        failureRedirect: `/login`,
    }),
    auth.loginUser
);

router.get(`/logout`, auth.logoutUser);

module.exports = router;
