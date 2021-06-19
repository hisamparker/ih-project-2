module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // when user logs in, add an originalUrl property to the session object and make the value the original Url stored on the request object
        req.session.originalUrl = req.originalUrl;
        req.flash(`error`, `You must be logged in first!`);
        return res.redirect(`/login`);
    }
    next();
};
