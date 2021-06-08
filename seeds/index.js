require(`dotenv`).config();

const mongoose = require(`mongoose`);
const cities = require(`./cities`);
const { places, descriptors } = require(`./seedHelpers`);
const Spot = require(`../models/spot.model`);

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `connection error:`));
db.once(`open`, () => {
    console.log(`Database: ${process.env.DB_NAME} connected`);
});

// choose a random element from either descriptors or places
const selection = (array) => array[Math.floor(Math.random() * array.length)];

// seed db with random cafes
const seedDB = async () => {
    // delete db before seeding
    await Spot.deleteMany({});
    // loop over cities array
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const spot = new Spot({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            author: `60bb2188022c9e39f22d5a19`,
            name: `${selection(descriptors)} ${selection(places)}`,
            // https://dev.to/desi/using-the-unsplash-api-to-display-random-images-15co
            image: `https://source.unsplash.com/collection/4794086`,
            description: `I am baby 8-bit synth direct trade bespoke PBR&B. Vinyl polaroid actually art party normcore coloring book mumblecore butcher meggings gastropub chia you probably not heard of them gentrify. Truffaut church-key quinoa gluten-free, actually bushwick semiotics heirloom twee four dollar toast brooklyn.`,
        });
        await spot.save();
    }
};

// close connection so I don't have to ctrl C (seedDB is async so it returns a promise because it's an async function so then is A-OK)
seedDB().then(() => mongoose.connection.close());
