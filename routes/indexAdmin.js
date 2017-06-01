var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require('../models/user.model');


/* GET login page. */
router.get('/', function (req, res, next) {
  var msg=req.flash('loginMessage');
  res.render('indexAdmin',{ message: msg});
});

//  HANDLE LOGIN REQUEST
router.post('/', 
passport.authenticate('admin-local-login',
  {
    successRedirect: '/admin',
    failureRedirect: '/admin/index',
    failureFlash: true,
  })
);

router.post('/signup',
passport.authenticate('admin-local-signup',
{
    successRedirect: '/',
    failureRedirect: '/admin/index',
    failureFlash: true,
}));



//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.redirect('/admin');
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/admin/index');
  }
}

module.exports = router;
