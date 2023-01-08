const { date } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    DateTime: {
        type: String,

    },
    message: {
        type: String,
    },
    phone: {
        type: Number,
    }
})


module.exports = mongoose.model('Book', BookSchema);