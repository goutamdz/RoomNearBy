const joi = require('joi');

let joeSchema=joi.object({
    title:joi.string().min(1).required(),
    description:joi.string().min(1).max(600).required(),
    price:joi.number().min(0).required(),
    location:joi.string().required(),
    country:joi.string(),
    Email:joi.required(),
    phoneNumber:joi.string().max(15).required()
}).required();

let commentSchema=joi.object({
    rating:joi.number().min(1).max(5).required(),
    comment:joi.string().min(1).required()
}).required();

module.exports={joeSchema,commentSchema}
