var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require('../models/user.model');


/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('signup',{ message: req.flash('signupMessage')});
});

router.post('/', passport.authenticate('local-signup', {
  successRedirect: '/', // redirect to the secure profile section
  failureFlash: true, // allow flash messages
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  
}));

module.exports = router;
