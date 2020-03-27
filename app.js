const moment = require('moment');
const config = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ExpressSession = require('express-session');
const expressValidator = require('express-validator');
const messages = require('express-messages');
const flash = require('connect-flash');
const expressFlash = require('express-flash');
//const expressFlash = require('express-flash');
const hbs = require('express-handlebars');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Application Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/auth');

var app = express();


// Template engine
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    formatDate: function (date, format) {
      return moment().format('MMMM Do YYYY, h:mm:ss a'); // March 10th 2020, 8:56:42 am
    },
    increment: function (index) {
      index++;
      return index;
    },
    count: function (index) {
      index++;
      return index;
    },
    math: function (total) {
      return Number(total);

    }
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('keyboard key'));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(ExpressSession({
  secret: 'max',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Express vaidator middleware
app.use(expressValidator());
app.use(flash());
app.use(expressFlash()); //flash message

// Custom flash middleware 
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});


//app.use(validator());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/access', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
