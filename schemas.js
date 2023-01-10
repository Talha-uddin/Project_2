const Joi = require('joi');

module.exports.groundSchema = Joi.object({
    ground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


module.exports.eshopSchema = Joi.object({
    e_shop: Joi.object({
        title: Joi.string(),
        price: Joi.number(),
        image: Joi.string(),
        description: Joi.string(),

    })
})