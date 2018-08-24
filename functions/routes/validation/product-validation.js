var Joi = require('joi');

module.exports = {
    options: { allowUnknownBody: false },
    body: {
        category: Joi.number().required(),
        name: Joi.string().min(2).max(100).required()
    }
};

