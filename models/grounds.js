const mongoose = require('mongoose');
const Book = require('./books');
const Review = require('./review')
const Schema = mongoose.Schema;
const Wishlist = require('./wishlist')



const GroundsSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book',
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Wishlist'
    }]
});

GroundsSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Ground', GroundsSchema);