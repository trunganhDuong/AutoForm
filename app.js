var passport = require('passport');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./config/auth');
var session = require('express-session');

var index = require('./routes/index');
var signup = require('./routes/signup');
var home = require('./routes/home');
var profile = require('./routes/profile')
var admin = require('./routes/admin')
var field = require('./routes/field');
var form = require('./routes/form');
var account = require('./routes/account');
var location = require('./routes/location');
var organization = require('./routes/organization');
var database = require('./config/database');
var app = express();

//  connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI||database.hostURL);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: 'ilovescotchscotchyscotchscotch',
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60*60*30,
    expires: new Date(Date.now()+1000*60*60*3)
  }
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//  CONFIG THE PASSPORT
require('./config/passport')(passport);

// CATCH THE ROUTES
app.use('/', index);
app.use('/signup', signup);
app.use('/home', home)
app.use('/profile', profile);
app.use('/admin', admin);
app.use('/admin/field', field);
app.use('/admin/form', form);
app.use('/admin/account', account);
app.use('/admin/location', location);
app.use('/admin/organization', organization);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
