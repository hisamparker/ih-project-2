module.exports.isLoggedIn = (req, res, next) => {
    // when user logs in, add an originalUrl property to the session object and make the value the original Url stored on the request object
    if (!req.isAuthenticated()) {
        req.session.originalUrl = req.originalUrl;
        req.flash(`error`, `You must be logged in first!`);
        return res.redirect(`/login`);
    }
    next();
};
