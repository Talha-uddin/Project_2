const express = require('express');
const router = express.Router();
const E_shop = require('../models/e_shops');
const catchAsync = require('../utils/catchAsync')
const Cart = require('../models/cart');
const { isLoggedIn, isAuthor, isAuthorE } = require('../midddleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/new', isLoggedIn, (req, res) => {
    res.render('eshops/new');
})
router.get('/', catchAsync(async(req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const eshops = await E_shop.find({ title: regex })
        res.render('eshops/index', { eshops })
    } else {
        const eshops = await E_shop.find({})
        res.render('eshops/index', { eshops })
    }


}))
router.post('/', isLoggedIn, upload.array('image'), catchAsync(async(req, res) => {
    const eshop = new E_shop(req.body.eshop);
    eshop.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    eshop.author = req.user._id;
    await eshop.save();
    req.flash('success', 'Successfully added a new product!')
    res.redirect(`/eshops/${eshop._id}`)
}))

router.get('/:id', catchAsync(async(req, res) => {
    const eshop = await E_shop.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!eshop) {
        req.flash('error', 'Cannnot find that Product!')
        return res.redirect('/eshops');
    }
    res.render('eshops/show', { eshop });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const eshop = await E_shop.findById(req.params.id)
    if (!eshop) {
        req.flash('error', 'Unable to find the product page!!')
        return res.redirect('/eshops');
    }
    res.render('eshops/edit', { eshop })
}))

router.put('/:id', isLoggedIn, isAuthorE, upload.array('image'), catchAsync(async(req, res) => {
    const { id } = req.params;
    const eshop = await E_shop.findByIdAndUpdate(id, {...req.body.eshop })
    const imges = req.files.map(f => ({ url: f.path, filename: f.filename }))
    eshop.images.push(...imges);
    await eshop.save()
    req.flash('success', 'Successfully Updated The Product');
    res.redirect(`/eshops/${eshop._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthorE, catchAsync(async(req, res) => {
    const { id } = req.params;
    await E_shop.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted The Product..');
    res.redirect('/eshops');
}))

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// router.get('/cart/:id', async(req, res) => {
//     const { id } = req.params;
//     const cart = new Cart(req.session.cart ? req.session.cart : {});
//     E_shop.findById(id, function(err, product) {
//         if (err) {
//             return res.redirect('/');
//         }
//         cart.add(product, product.id);
//         req.session.cart = cart;
//         console.log(req.session.cart);
//         res.redirect('/')
//     })
// })

// router.post('/:id/addCart', async(req, res) => {
//     const quantity = req.body;
//     E_shop.findById(req.params.id, function(err, foundProduct) {
//         if (err) {
//             console.log(err);
//         }
//         const product = {
//                 item: foundProduct._id,
//                 qty: quantity,
//                 price: foundProduct.price * quantity
//             }
//             // Cart.owner = req.user._id;
//         Cart.items.push(product)
//         Cart.save();
//         res.redirect('/cart');
//     })
// })




module.exports = router;