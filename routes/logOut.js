var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  var path;
  if(req.user.admin.email) path='/admin/index';
  else path='/';
  req.logOut();
  res.redirect(path);
  
});

module.exports = router;
