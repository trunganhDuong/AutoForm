var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require('../models/user.model');


/* GET login page. */
router.get('/', function (req, res, next) {
  var msg=req.flash('loginMessage');
  res.render('index',{ message: msg});
});

//  HANDLE LOGIN REQUEST
router.post('/', 
passport.authenticate('local-login',
  {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true,
  })
);

//  HANDLE LOGIN WITH FACEBOOK
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {  
  successRedirect: '/home',
  failureRedirect: '/',
}));

//  HANDLE LOGIN WITH GOOGLE
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {  
  successRedirect: '/home',
  failureRedirect: '/',
}));

//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.redirect('/home');
    return next();
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/');
  }
}

module.exports = router;
