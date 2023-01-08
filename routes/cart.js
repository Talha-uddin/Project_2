const express = require('express');
const router = express.Router();
const E_shop = require('../models/e_shops');
const Cart = require('../models/cart')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../midddleware');

router.get('/cart', async(req, res) => {
    const carts = await Cart.find({});
    res.render('carts/index', { carts });
})

// router.get('/cart/:id', isLoggedIn, catchAsync(async(req, res) => {
//     const user = await User.findById(req.params.id);

//     res.render('users/userProfile', { user });
// }))


router.post('/eshops/:id/carts', isLoggedIn, async(req, res) => {
    const eshop = await E_shop.findById(req.params.id);
    const cart = new Cart(req.body.cart);
    eshop.carts.push(cart);
    await cart.save();
    await eshop.save();
    res.redirect('/cart');
})

module.exports = router;

// router.post('/', validateReview, catchAsync(async(req, res) => {
//     const ground = await Ground.findById(req.params.id)
//     const review = new Review(req.body.review)
//     ground.reviews.push(review);
//     await review.save();
//     await ground.save();
//     req.flash('success', 'Created new review')
//     res.redirect(`/grounds/${ground._id}`);
// }))