var express = require('express');
var router = express.Router();

/* GET account management page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/account-management.html',{root: './'})
});

module.exports = router;
