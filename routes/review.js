const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require('../models/review');
const Ground = require('../models/grounds')
const E_shop = require('../models/e_shops')

const { reviewSchema } = require('../schemas.js')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../midddleware')

router.post('/grounds/:id/reviews', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ground.reviews.push(review);
    await review.save();
    await ground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/grounds/${ground._id}`);
}))

router.delete('/grounds/:id/reviews/:reviewId', isLoggedIn, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Ground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/grounds/${id}`)
}))

router.post('/eshops/:id/reviews', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const eshop = await E_shop.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    eshop.reviews.push(review);
    await review.save();
    await eshop.save();
    req.flash('success', 'Created new review')
    res.redirect(`/eshops/${eshop._id}`);
}))

router.delete('/eshops/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await E_shop.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/eshops/${id}`)
}))

module.exports = router;