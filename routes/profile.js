var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/profile.html',{root: './'})
});

module.exports = router;
