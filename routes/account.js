var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = require('../models/account.model')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var flash=require('connect-flash');
/* GET account management page. */
router.get('/', function (req, res, next) {
  Account.find(function (err, books) {
    if (err) res.send(err);
    res.render('account', { books: books });
  })
});

router.get('/:id',function(req,res){
  Account.find({_id:req.params.id}).exec(function(err,account){
    if(err) res.send(err);
    else
      res.render('accDetail',{account:account});
  })
})

router.post('/', urlencodedParser, function (req, res) {
  /*req.flash('emailExisted','This email is already registed. Please try another email');
  req.flash('userExisted','This username is already registed. Please try another email');*/

  Account.findOne({$or:[{email:req.body.email},{username:req.body.username}]}).exec(function (err, acc) {
    if (err) res.send(err);
    if (acc) {
      console.log('account existed');
      res.redirect('back');
    }
    else {
      Account.create(req.body, function (err, account) {
        if (err) res.send(err);
        console.log(account);
        res.redirect('back');
      })
    }
  })

})

module.exports = router;
