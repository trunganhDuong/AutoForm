var express = require('express');
var router = express.Router();

/* GET field management  page. */
router.get('/', function(req, res, next) {
  res.sendFile('/views/field-management.html',{root: './'})
});

module.exports = router;
