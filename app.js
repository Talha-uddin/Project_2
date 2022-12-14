if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const Ground = require('./models/grounds')
console.log(process.env.SECRET);

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


const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/users')
const groundRoutes = require('./routes/grounds')
const reviewRoutes = require('./routes/review');
const eshopRoutes = require('./routes/e_shop')
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist')
const catchAsync = require('./utils/catchAsync');


mongoose.connect('mongodb://localhost:27017/white-soxs')


const db = mongoose.connection;
db.on("error", console.error.bind(console, "conncetion error: "));
db.once('open', () => {
        console.log("Database connected!")
    })
    // const Publishable_Key = pk_test_51MO7XyBYCIbILnbeNkZZ1suERyMzvsnWtb1e14G0WXWHcSaGZK0uNUbPNQNyOkzIOcOJCWsBLkMyfY1UUy5LNtmy00UdTL7eGI
    // const SECRET_KEY = sk_test_51MO7XyBYCIbILnbeadoY4JL3faRxWL3Unype9wGDPd41pO9NhflOzEZbeLgAhh0wGuaBEP1OsCouKAt0rBmNIkPo002Kfyoutsrs
    // const stripe = require('stripe')(SECRET_KEY)
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
    console.log(req.session);
    res.locals.session = req.session;
    res.locals.cart = req.session.cart;
    res.locals.items = req.session.items;
    res.locals.user = req.user;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})



app.use('/', userRoutes)
app.use('/grounds', groundRoutes)
app.use('/grounds/:id/books', bookRoutes);
app.use('/', reviewRoutes)
app.use('/eshops', eshopRoutes)
app.use('/', cartRoutes);
app.use('/', wishlistRoutes)




app.get('/', async(req, res) => {
    res.render('home')
})


app.get('/contact', async(req, res) => {
    res.render('contact');
})

app.get('/payment', async(req, res) => {
    res.render('payment', {})
})


app.post('/payment', function(req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Talha Uddin',
            address: {
                line1: 'TC 9/4 Old MES colony',
                postal_code: '3100',
                city: 'Sylhet',
                state: 'Sylhet',
                country: 'Bangladesh',
            }
        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 7000, // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs 
        })
        .catch((err) => {
            res.send(err) // If some error occurs 
        });
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