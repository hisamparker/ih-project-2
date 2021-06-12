const mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// assign value of mongoose connection to a var to make it easier to reuse
const db = mongoose.connection;
// bind console.error to the console object, then pass in a string to describe the location of the error (connection)
db.on(`error`, console.error.bind(console, `connection error:`));
// open the db!
db.once(`open`, () => {
    console.log(`Database: ${process.env.DB_NAME} connected`);
});
