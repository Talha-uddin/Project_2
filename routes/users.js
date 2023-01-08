const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport')
const { isLoggedIn } = require('../midddleware')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password, firstName, lastName } = req.body;
        const user = new User({ email, username, firstName, lastName });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to White SOXX!')
            res.redirect('/grounds')
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/grounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})



router.get('/logout', (req, res) => {
    req.logout(catchAsync);
    req.flash('success', 'Goodbye!!');
    res.redirect('/grounds');
})

router.get('/users/:id', isLoggedIn, catchAsync(async(req, res) => {
    const user = await User.findById(req.params.id);
    res.render('users/userProfile', { user });
}))

router.put('/users/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {...req.body.user });
    req.flash('success', 'Successfully updated Ground!')
    res.redirect(`/users/${user._id}`)
}))


module.exports = router;