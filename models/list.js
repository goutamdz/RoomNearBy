const mongoose = require('mongoose');
const review = require('./review.js');
const User = require("./user.js");
const { required } = require('joi');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    phoneNumber: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    }

});

const list = mongoose.model('list', listingSchema);

module.exports = list;