const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Ground = require('../models/grounds');
const Wishlist = require('../models/wishlist');
const { route } = require('./books');


router.post('/grounds/:id/wishlist', async(req, res) => {
    const ground = await Ground.findById(req.params.id);
    const wishlist = new Wishlist(req.body.wishlist);
    ground.wishlist.push(wishlist);
    await wishlist.save();
    await ground.save();
    res.redirect('/wishlist');
})

router.get('/wishlist', async(req, res) => {
    const ground = await Ground.find({})
    const wishlist = await Wishlist.find({});
    res.render('wishlist/index', { wishlist, ground });
})

router.delete('/wishlist/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Wishlist.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted ground')
    res.redirect('/wishlist');
}))

module.exports = router;