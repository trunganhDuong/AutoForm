var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user.model')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var flash = require('connect-flash');


/* GET account management page. */
router.get('/', function (req, res, next) {
  User.find(function (err, users) {
    if (err) res.send(err);
    else {
      res.render('account', { users: users });
      console.log('******************************************');
    }

  })
});

router.get('/:id', function (req, res) {
  User.findOne({ _id: req.params.id }, function (err, user) {
    if (err) res.send(err);
    else {

      res.render('accDetail', { user: user });
      console.log('******************************************');
      res.end();
    }
  })
})

router.post('/', urlencodedParser, function (req, res) {
  User.findOne(
    {
      "local.email": req.body.email
    },
    function (err, user) {
      if (err) res.send(err);
      else {
        if (user) {
          res.status(400);
          res.end();
        }
        else {
          var newUser = new User();
          newUser.local.email = req.body.email;
          newUser.local.password = newUser.generateHash(req.body.password);
          newUser.save(function (err) {
            if (err)
              res.send(err);
            else{
              res.status(204);
              res.end();
            }
          });
        }
      }

    })
})


router.delete('/:id', function (req, res) {
  User.findOneAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.send(err);
    else {
      res.status(204);
      console.log('******************************************');
      res.end();
    }
  })
})

router.put('/:id', urlencodedParser, function (req, res) {
  User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  }, function (err, user) {
    if (err) res.send(err);
    else {
      if (user.length >= 2) {
        res.status(400);
        res.end();
      }
      else {
        User.findOneAndUpdate(
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
          function (err, user) {
            if (err) res.send(err);
            else {
              res.status(204);
              res.end();
            }
          })
      }

    }
  });

})

module.exports = router;
