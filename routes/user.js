var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
  var user;
  if (req.user.facebook.email) user = req.user.facebook;
  else if (req.user.google.email) user = req.user.google;
  else user = req.user.local;

  res.render('user', {
    message: req.flash('changeMessage'),
    user: user
  });
});

//  CHANGE PASSWORD
router.put('/',isLoggedIn, function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) res.send(err);
    else {
      if (user) {
        if (!user.validPassword(req.body.old)) { // IF PASSWORD IS NOT CORRECT
          req.flash('changeMessage', 'Mật khẩu cũ không chính xác');
          res.status(400);
          res.end();
        }
        else{
          User.findOneAndUpdate(
            {
              _id:req.user._id
            },
            {
              $set:{"local.password":user.generateHash(req.body.new)}
            },
            {
              upsert:true
            },
            function(err){
              if(err){
                res.send(err);
                res.status(400);
                res.end();
              }
              else{
                res.status(204);
                res.end();
              }
            });
        }
      }
    }
  })
})

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
