//npm i joi //we can also visit the doc of joi for more info.
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().allow("", null),
            filename: Joi.string().optional().allow(null)
        }).optional().allow(null),
        category: Joi.string().valid(
            "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
            "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"
        ).default("Trending") // Set default to "Rooms" in Joi
        .required(), // Allow these specific categories
        geometry: Joi.object({
            type: Joi.string().valid("Point").required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required()
        }).optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).default(3),
        comment: Joi.string().required(),
    }).required(),
});
