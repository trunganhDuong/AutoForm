var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.sendFile('/views/home.html',{root: './'})
});

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/index');
}
module.exports = router;
