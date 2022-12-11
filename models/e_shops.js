const mongoose = require('mongoose');
const { Schema } = mongoose;

const E_shopSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String
})

module.exports = mongoose.model('E_shop', E_shopSchema)