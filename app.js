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
const catchAsync = require('./utils/catchAsync');


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