var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/admin.html',{root: './'})
});

module.exports = router;
