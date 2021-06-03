const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
});
