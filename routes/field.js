var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var flash = require('connect-flash');
var Field = require('../models/field.model')

/* GET field management  page. */
router.get('/', function (req, res, next) {
  Field.find({}, function (err, fields) {
    if (err) res.send(err);
    else {
      res.render('field', { fields: fields });
      console.log('******************************************');
    }
  })
});

router.get('/:id', function (req, res) {
  Field.findOne({ _id: req.params.id }, function (err, field) {
    if (err) res.send(err);
    else {
      res.render('fieldDetail', { field: field });
      console.log('******************************************');
    }
  })
})

router.put('/:id', urlencodedParser, function (req, res) {
  Field.findOne({ name: req.body.name }, function (err, field) {
    if (err) res.send(err);
    else {
      if (field) {
        res.send(400);
        res.end();
      }
      else {
        Field.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name
            }
          },
          {
            upsert: true
          },
          function (err, field) {
            if (err) res.send(err);
            else {
              res.status(204);
              res.end();
            }
          });
      }
    }
  });

});
router.post('/', urlencodedParser, function (req, res) {
  Field.findOne({ name: req.body.name }, function (err, field) {
    if (err) res.send(err);
    else {
      if (field) {
        res.status(400);
        res.end();
      }
      else {
        Field.create(req.body, function (err, field) {
          if (err) res.send(err);
          else {
            res.status(204);
            console.log('******************************************');
            res.end();
          }
        })
      }
    }
  })

})

router.delete('/:id', function (req, res) {
  Field.findOneAndRemove({ _id: req.params.id }, function (err, field) {
    if (err) res.send(err);
    else {
      console.log('******************************************');
      res.status(204);
      res.end();
    }
  });
});
module.exports = router;
