var express = require('express');
var router = express.Router();
var History=require('../models/history.model');

/* GET admin home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.send('ancd');
});

router.post('/',function(req,res){
    History.create(req.body,function(err){
        if(err) res.send(err);
        else{
            res.status(204);
            res.end();
        }
    });
});

//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.next();
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/');
  }
}
module.exports = router;
