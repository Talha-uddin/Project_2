const express = require('express');
const router = express.Router();
const E_shop = require('../models/e_shops');
const Cart = require('../models/cart')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../midddleware');






router.post('/eshops/:id/carts', isLoggedIn, async(req, res) => {
    const eshop = await E_shop.findById(req.params.id);
    const cart = new Cart(req.body.cart);
    eshop.carts.push(cart);
    await cart.save();
    await eshop.save();
    res.redirect('/carts');
})

router.get('/carts', async(req, res) => {
    const eshop = await E_shop.find({});
    const cart = await Cart.find({});
    res.render('carts/index', { cart, eshop });
})

router.delete('/carts/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted item from the cart')
    res.redirect('/carts');
}))

module.exports = router;