const mongoose = require('mongoose');
const { Schema } = mongoose;
const Ground = require('../models/grounds')

const wishlistSchema = new Schema({
    groundId: String,
    title: String,
    images: String,
    price: Number,
    location: String,
    description: String,
})

module.exports = mongoose.model('Wishlist', wishlistSchema);