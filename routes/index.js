var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/first-page.html',{root: './'})
});

module.exports = router;
