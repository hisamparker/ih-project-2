module.exports = (asyncFunction) => (req, res, next) => {
    // if something goes wrong in function, pass the error threw to next!
    asyncFunction(req, res, next).catch(next);
};

// function promiseWrapper(fn) {
// 	return (req, res, next) => {
// 		fn(req, res).catch(next);
// 	};
// }
