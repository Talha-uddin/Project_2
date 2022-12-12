const express = require('express');
const router = express.Router();
const Ground = require('../models/grounds');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { groundSchema } = require('../schemas.js')
const { isLoggedIn } = require('../midddleware')

const validateGround = (req, res, next) => {
    const { error } = groundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const grounds = await Ground.find({})
    res.render('grounds/index', { grounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('grounds/new')
})

router.post('/', validateGround, catchAsync(async(req, res, next) => {

    const ground = new Ground(req.body.ground);
    ground.author = req.user._id;
    await ground.save();
    req.flash('success', 'Successfully made new Ground!')
    res.redirect(`/grounds/${ground._id}`)

}))

router.get('/:id', catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id).populate('reviews').populate('author');
    console.log(ground)
    if (!ground) {
        req.flash('error', 'Cannot find the ground!')
        return res.redirect('/grounds')
    }
    res.render('grounds/show', { ground })

}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id);
    if (!ground) {
        req.flash('error', 'Cannot find the ground!')
        return res.redirect('/grounds')
    }
    res.render('grounds/edit', { ground })
}))

router.put('/:id', validateGround, catchAsync(async(req, res) => {
    const { id } = req.params
    const ground = await Ground.findByIdAndUpdate(id, {...req.body.ground });
    req.flash('success', 'Successfully updated Ground!')
    res.redirect(`/grounds/${ground._id}`)
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Ground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted ground')
    res.redirect('/grounds');
}))

module.exports = router;