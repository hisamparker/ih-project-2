const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
            default: 'https://unsplash.com/photos/mH8g-fDYVLU',
            set: (v) => (v === '' ? '/images/puffgirls.png' : v),
        },
        aboutMe: {
            type: String,
        },
        location: {
            type: String,
        },
        favoriteSpots: {
            type: String,
        },
        authoredSpots: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Spot',
            },
        ],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

userSchema.plugin(passportLocalMongoose);

module.exports = model('user', userSchema);
