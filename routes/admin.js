var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.sendFile('/views/admin.html',{root: './'})
});

//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return next();
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/admin/index');
  }
}
module.exports = router;
