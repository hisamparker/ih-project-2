const { Schema, model } = require(`mongoose`);
const slug = require(`mongoose-slug-generator`);

const Review = require(`./review.model`);

const spotSchema = new Schema(
    {
        name: {
            type: String,
            lowercase: true,
            trim: true,
        },
        slug: {
            type: String,
            slug: `name`,
            unique: true,
        },
        hasChangeTable: {
            type: Boolean,
        },
        hasPublicToilet: {
            type: Boolean,
        },
        hasToys: {
            type: Boolean,
        },
        hasKidsMenu: {
            type: Boolean,
        },
        hasBabyccinos: {
            type: Boolean,
        },
        hasHighChairs: {
            type: Boolean,
        },
        author: {
            // not an array like usual because their is only ever 1 author
            type: Schema.Types.ObjectId,
            ref: `User`,
        },
        images: [
            {
                url: String,
                filename: String,
            },
        ],
        description: {
            type: String,
            // required: [true, `Please include a description`],
        },
        // https://mongoosejs.com/docs/geojson.html this matches geoJSON formatting exactly, there's more in the mongoose docs
        geometry: {
            type: {
                type: String,
                // location.type must be Point!
                enum: [`Point`],
                require: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        location: {
            type: String,
            // required: [true, `Please include a location`],
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: `Review`,
            },
        ],
    },
    {
        timestamps: { createdAt: `created_at`, updatedAt: `updated_at` },
    }
);

// Initialize
spotSchema.plugin(slug);

// middleware that runs after findOneAndDelete is called on a spot, the spot's document is passed into the callback
spotSchema.post(`findOneAndDelete`, async (spot) => {
    // if it exists, delete all the reviews in the document
    if (spot) {
        await Review.deleteMany({
            _id: {
                // $in (looks for the thing to remove inside the given param), spot.reviews is where I want to look for the reviews I want to delete
                $in: spot.reviews,
            },
        });
    }
});

module.exports = model(`Spot`, spotSchema);
