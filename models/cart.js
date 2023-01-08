const mongoose = require('mongoose');
const { Schema } = mongoose;


const CartSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "E_shop"
    },
    title: String,
    image: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        // required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    description: {
        type: String
    },
    total: {
        type: Number,

    }
})


module.exports = mongoose.model('cart', CartSchema)