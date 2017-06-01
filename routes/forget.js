var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
/* GET admin home page. */
router.get('/', function (req, res, next) {
  var msg=req.flash('valid');
  res.render('forget', {
    message: msg
  });
});

router.post('/', function (req, res) {
  User.findOne({'local.email':req.body.email},function(err,user){
    if(err) res.send(err);
    else{
      if(user){
        req.flash('valid','Mật khẩu đã được gửi vào email '+req.body.email+'   Vui lòng kiểm tra hộp thư');
        res.status(400);
        res.end();
      }
      else{
        req.flash('valid','Tài khoản không tồn tại');
        res.status(400);
        res.end();
      }
    }
  })
});
module.exports = router;
