const mongoose = require('mongoose');
const { Schema } = mongoose;
const Cart = require('../models/cart')
const Review = require('../models/review')

const E_shopSchema = new Schema({
    title: String,
    price: Number,
    images: [{
        url: String,
        filename: String
    }],
    description: String,
    quantity: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    carts: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

E_shopSchema.post('findOneAndDelete', async function(doc) {
    console.log('deleted')
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('E_shop', E_shopSchema)