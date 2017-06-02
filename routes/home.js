var express = require('express');
var router = express.Router();
var City = require('../models/city.model');
var Organization = require('../models/organization.model');
var Form = require('../models/form.model');
var Profile = require('../models/profile.model');


/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  City.find({}, function (err, cities) {
    if (err) res.send(err);
    else {
      Organization.find({}, function (err, orgs) {
        if (err) res.send(err);
        else {
          Form.find({}, function (err, forms) {
            if (err) res.send(err);
            else {
              Profile.find({userId:req.user._id}, function (err, profs) {
                if (err) res.send(err);
                else {
                  if (profs) {
                    res.render('home', {
                      forms: forms,
                      cities: cities,
                      orgs: orgs,
                      profs:profs
                    });
                  }
                }
              });

            }
          });
        }
      })
    }
  })
});





//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()&& !req.user.admin.email) {
    console.log(req.user);
    return next();
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/');
  }
}


module.exports = router;
