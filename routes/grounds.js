const express = require('express');
const router = express.Router();
const Ground = require('../models/grounds');
const catchAsync = require('../utils/catchAsync')
const { groundSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor, validateGround } = require('../midddleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });




router.get('/', catchAsync(async(req, res) => {

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const grounds = await Ground.find({ title: regex })
        res.render('grounds/index', { grounds })

    } else {
        const grounds = await Ground.find({})
        res.render('grounds/index', { grounds });
    }
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('grounds/new')
})

router.post('/', isLoggedIn, upload.array('image'), validateGround, catchAsync(async(req, res, next) => {

    const ground = new Ground(req.body.ground);
    ground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    ground.author = req.user._id;
    await ground.save();
    console.log(ground)
    req.flash('success', 'Successfully made new Ground!')
    res.redirect(`/grounds/${ground._id}`)

}))

router.get('/:id', catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(ground)
    if (!ground) {
        req.flash('error', 'Cannot find the ground!')
        return res.redirect('/grounds')
    }
    res.render('grounds/show', { ground })

}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const ground = await Ground.findById(req.params.id);
    if (!ground) {
        req.flash('error', 'Cannot find the ground!')
        return res.redirect('/grounds')
    }
    res.render('grounds/edit', { ground })
}))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateGround, catchAsync(async(req, res) => {
    const { id } = req.params
    const ground = await Ground.findByIdAndUpdate(id, {...req.body.ground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    ground.images.push(...imgs);
    await ground.save()
    req.flash('success', 'Successfully updated Ground!')
    res.redirect(`/grounds/${ground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Ground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted ground')
    res.redirect('/grounds');
}))


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;