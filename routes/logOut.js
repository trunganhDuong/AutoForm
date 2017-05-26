var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
