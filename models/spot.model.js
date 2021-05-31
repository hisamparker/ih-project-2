const {Schema, model} = require('mongoose');

const spotSchema = new Schema(
  {
    name: String,
    image: String,
    description: String,
    location: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model('Spot', spotSchema);