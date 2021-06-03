const { Schema, model } = require('mongoose');

const spotSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please name your spot'],
        },
        author: {
            type: String,
        },
        image: {
            type: String,
            default: 'https://unsplash.com/photos/mH8g-fDYVLU',
            set: (v) => (v === '' ? '/images/puffgirls.png' : v),
        },
        description: {
            type: String,
            required: [true, 'Please include a description'],
        },
        location: {
            type: String,
            required: [true, 'Please include a location'],
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

module.exports = model('Spot', spotSchema);
