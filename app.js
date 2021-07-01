const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log("connected to database")
    }).catch((e) => {
        console.log(e, 'error connecting to database')
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'PleaseUseABetterSecret!!',
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

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.get('/', (req, res) => {
    res.send("ggwp")
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(err.statusCode).render('errorTemplate', { err, title: 'ERROR!' })
})
app.listen('3000', () => {
    console.log("Serving on port 3000")
})