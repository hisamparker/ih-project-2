// wrap around async routes so we don't have to use try catch alllll the time
module.exports = (asyncFunction) => (req, res, next) => {
    // function that accepts an async function, then executes it, then if something goes wrong in function, passes the error to next!
    asyncFunction(req, res, next).catch(next);
};

// function promiseWrapper(fn) {
// 	return (req, res, next) => {
// 		fn(req, res).catch(next);
// 	};
// }
