const { Schema, model } = require(`mongoose`);
const passportLocalMongoose = require(`passport-local-mongoose`);
// Passport-Local Mongoose will add a username, hash and salt field to store the username,
// the hashed password and the salt value.
// Additionally Passport-Local Mongoose adds some methods to your Schema.
const Spot = require(`./spot.model`);

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        authoredSpots: [
            {
                type: Schema.Types.ObjectId,
                ref: `Spot`,
            },
        ],
    },
    {
        timestamps: { createdAt: `created_at`, updatedAt: `updated_at` },
    }
);

// Plugin Passport-Local Mongoose to User schema
userSchema.plugin(passportLocalMongoose);

module.exports = model(`User`, userSchema);
