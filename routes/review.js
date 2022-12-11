const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require('../models/review');
const Ground = require('../models/grounds')

const { reviewSchema } = require('../schemas.js')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id)
    const review = new Review(req.body.review)
    ground.reviews.push(review);
    await review.save();
    await ground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/grounds/${ground._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Ground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/grounds/${id}`)
}))

module.exports = router;