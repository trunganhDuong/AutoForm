var express = require('express');
var router = express.Router();

/* GET organization page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/organization.html',{root: './'})
});

module.exports = router;
