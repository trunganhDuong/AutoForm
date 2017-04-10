var express = require('express');
var router = express.Router();

/* GET form management page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/form-management.html',{root: './'})
});

module.exports = router;
