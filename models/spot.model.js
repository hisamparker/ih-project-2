const { Schema, model } = require(`mongoose`);

const Review = require(`./review.model`);

const spotSchema = new Schema(
    {
        name: {
            type: String,
            // required: [true, `Please name your spot`],
        },
        author: {
            // not an array like usual because their is only ever 1 author
            type: Schema.Types.ObjectId,
            ref: `User`,
        },
        image: {
            type: String,
            default: `https://unsplash.com/photos/mH8g-fDYVLU`,
            set: (v) => (v === `` ? `/images/puffgirls.png` : v),
        },
        description: {
            type: String,
            // required: [true, `Please include a description`],
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

// middleware that runs after findOneAndDelete is called on a spot, the spot's document is passed into the callback
spotSchema.post(`findOneAndDelete`, async (spot) => {
    // if it exists, delete all the reviews in the document, $in (looks for the thing to remove inside the given param), spot.reviews is where I want to look for the reviews I want to delete
    if (spot) {
        await Review.deleteMany({
            _id: {
                $in: spot.reviews,
            },
        });
    }
});

module.exports = model(`Spot`, spotSchema);
