const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const E_shop = require('./models/e_shops')

const userRoutes = require('./routes/users')
const groundRoutes = require('./routes/grounds')
const reviewRoutes = require('./routes/review')

mongoose.connect('mongodb://localhost:27017/white-soxs')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conncetion error: "));
db.once('open', () => {
    console.log("Database connected!")
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbebettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})



app.use('/', userRoutes)
app.use('/grounds', groundRoutes)
app.use('/grounds/:id/reviews', reviewRoutes)

app.get('/eshops', async(req, res) => {
    const eshops = await E_shop.find({})
    res.render('eshops/index', { eshops })

})


app.get('/eshops/new', (req, res) => {
    res.render('eshops/new');
})

app.post('/eshops', async(req, res) => {
    const eshop = new E_shop(req.body.eshop);
    await eshop.save();
    res.redirect(`/eshops/${eshop._id}`)
})

app.get('/eshops/:id', async(req, res) => {
    const eshop = await E_shop.findById(req.params.id);
    res.render('eshops/show', { eshop });
})

app.get('/eshops/:id/edit', async(req, res) => {
    const eshop = await E_shop.findById(req.params.id)
    if (!eshop) {
        req.flash('error', 'Unable to find the product page!!')
        return res.redirect('/eshops');
    }
    res.render('eshops/edit', { eshop })
})

app.put('/eshops/:id', async(req, res) => {
    const { id } = req.params;
    const eshop = await E_shop.findByIdAndUpdate(id, {...req.body.eshop })
    req.flash('success', 'Successfully Updated The Product');
    res.redirect(`/eshops/${eshop._id}`)
})

app.delete('/eshops/:id', async(req, res) => {
    const { id } = req.params;
    await E_shop.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted The Product..');
    res.redirect('/eshops');
})

app.get('/', async(req, res) => {
    res.render('home')
})

app.get('/contact', async(req, res) => {
    res.render('contact');
})






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})