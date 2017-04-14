var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = require('../models/account.model')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var flash = require('connect-flash');


/* GET account management page. */
router.get('/', function (req, res, next) {
  Account.find(function (err, accounts) {
    if (err) res.send(err);
    else {
      res.render('account', { accounts: accounts });
      console.log('******************************************');
    }

  })
});

router.get('/:id', function (req, res) {
  Account.findOne({ _id: req.params.id }, function (err, account) {
    if (err) res.send(err);
    else {

      res.render('accDetail', { account: account });
      console.log('******************************************');
      res.end();
    }
  })
})

router.post('/', urlencodedParser, function (req, res) {
  Account.findOne(
    {
      $or: [{ email: req.body.email }, { username: req.body.username }]
    },
    function (err, account) {
      if (err) res.send(err);
      else {
        if (account) {
          res.status(400);
          res.end();
        }
        else {
          Account.create(req.body, function (err, account) {
            if (err) res.send(err);
            else {
              res.redirect('back');
              console.log('******************************************');
              res.end();
            }
          })
        }
      }

    })
})


router.delete('/:id', function (req, res) {
  Account.findOneAndRemove({ _id: req.params.id }, function (err, account) {
    if (err) res.send(err);
    else {
      res.status(204);
      console.log('******************************************');
      res.end();
    }
  })
})

router.put('/:id', urlencodedParser, function (req, res) {
  Account.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  }, function (err, account) {
    if (err) res.send(err);
    else {
      Account.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          $set:
          {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            type: req.body.type
          }
        },
        {
          upsert: true
        },
        function (err, account) {
          if (err) res.send(err);
          else {
            res.status(204);
            res.end();
          }
        })
    }
  });

})

module.exports = router;
