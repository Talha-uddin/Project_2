const express = require('express');
const router = express.Router({ mergeParams: true });
const Booking = require('../models/books');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Ground = require('../models/grounds');
const User = require('../models/user');


router.get('/', async(req, res) => {
    const ground = await Ground.findById(req.params.id);
    const book = new Booking()
    res.render('booking/new', { book, ground });
})


router.post('/', async(req, res) => {
    const ground = await Ground.findById(req.params.id);
    const book = new Booking(req.body.book);
    ground.books.push(book);
    await book.save();
    await ground.save();
    req.flash('success', 'Successfully booked the ground..');
    res.redirect(`/grounds/${ground._id}`);
})


module.exports = router;