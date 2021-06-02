const { Schema, model } = require('mongoose');

const spotSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please name your spot'],
        },
        image: {
            type: String,
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
