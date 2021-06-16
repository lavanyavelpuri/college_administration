const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const session = require('cookie-session')
const flash = require('connect-flash');
const passport = require('passport')
const store = require('store')
const methodOverride = require('method-override')

const app = express()
 require('./config/passport')(passport);
mongoose.connect('mongodb://localhost:27017/nodeapp',{useNewUrlParser: true, useUnifiedTopology: true},(err) => {
    if(!err)
    console.log("Database connected..");
    else
    console.log("Error");
})

app.use(expressLayouts)
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'))

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/nit', (req,res) => {
    res.render('home')
})

//global variables
app.use(function(req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/nit', require('./router/college'))
app.use('/nit/staff', require('./router/staff'))
app.use('/nit/student', require('./router/student'))
const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));