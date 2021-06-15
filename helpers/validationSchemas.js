const BaseJoi = require(`joi`);
// prevent cross site scripting https://auth0.com/blog/cross-site-scripting-xss/
const sanitizeHtml = require(`sanitize-html`);
// https://github.com/sideway/joi/issues/2453 extend joi to include sanitizeHTML in the validation process as a helper
// how joi extensions work, cool! https://joi.dev/api/?v=17.4.0#extensions
const extension = (joi) => ({
    type: `string`,
    base: joi.string(),
    messages: {
        "string.escapeHTML": `{{#label}} can't include HTML.`,
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // if the validated / cleaned input is not equal to the original input, send this message
                if (clean !== value) {
                    console.log(`clean`, clean, `value`, value);
                    // janky fix for sanitize issue with ampersand
                    if (value.includes(`<3`)) {
                        return value;
                    }
                    if (clean.includes(`&amp;`)) {
                        return value;
                    }
                    return helpers.error(`string.escapeHTML`, { value });
                }
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string().required().escapeHTML(),
        slug: Joi.string(),
        hasChangeTable: Joi.string(),
        hasPublicToilet: Joi.string(),
        hasToys: Joi.string(),
        hasKidsMenu: Joi.string(),
        hasBabyccinos: Joi.string(),
        hasHighChairs: Joi.string(),
        // image: Joi.string().required(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required(),
});
