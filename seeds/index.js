require(`dotenv`).config();

const mongoose = require(`mongoose`);
const cities = require(`./cities`);
const { places, descriptors, images } = require(`./seedHelpers`);
const Spot = require(`../models/spot.model`);
const dbUrl = `mongodb://localhost:27017/${process.env.DB_NAME}`;
// const dbUrl = process.env.MONGO_ATLAS_URL;

mongoose.connect(dbUrl, {
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
    try {
        // delete db before seeding
        await Spot.deleteMany({});
        // loop over cities array
        for (let i = 0; i < 50; i++) {
            const rand1000 = Math.floor(Math.random() * 1000);
            // select a random image url from images array
            const randomImagesUrl = selection(images);
            // the filename is the last section of the url beginning at `cute-spot/` so to get the matching filename get a substring of the url starting at the position of cute-spot/ (find that by using lastindexof)
            const randomImagesFileName = randomImagesUrl.substring(randomImagesUrl.lastIndexOf(`cute-spot/`));
            // add a second image to make sure that works :/
            const randomImagesUrl2 = selection(images);
            const randomImagesFileName2 = randomImagesUrl2.substring(randomImagesUrl2.lastIndexOf(`cute-spot/`));
            const spot = await new Spot({
                location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
                author: `60bb2188022c9e39f22d5a19`,
                name: `${selection(descriptors)} ${selection(places)}`,
                // https://dev.to/desi/using-the-unsplash-api-to-display-random-images-15co <- use this to seed using random images from unsplash api, not doing anymore, but nice to remember
                images: [
                    {
                        url: `${randomImagesUrl}`,
                        filename: `${randomImagesFileName}`,
                    },
                    {
                        url: `${randomImagesUrl2}`,
                        filename: `${randomImagesFileName2}`,
                    },
                ],
                geometry: {
                    type: `Point`,
                    coordinates: [139.88583, 35.634241],
                },
                description: `I am baby 8-bit synth direct trade bespoke PBR&B. Vinyl polaroid actually art party normcore coloring book mumblecore butcher meggings gastropub chia you probably not heard of them gentrify. Truffaut church-key quinoa gluten-free, actually bushwick semiotics heirloom twee four dollar toast brooklyn.`,
                hasChangeTable: `Yes`,
                hasPublicToilet: `Yes`,
                hasHighChairs: `Yes`,
                hasKidsMenu: `No`,
                hasBabyccinos: `Yes`,
                hasToys: `No`,
            });
            await spot.save();
        }
    } catch (e) {
        console.log(e);
    }
};

// close connection so I don't have to ctrl C (seedDB is async so it returns a promise because it's an async function so then is A-OK)
seedDB().then(() => mongoose.connection.close());
