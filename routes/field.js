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
  Field.find({},null,{sort:{order:1}},function (err, fields) {
    if (err) res.send(err);
    else {
      res.render('field', { fields: fields });
      console.log('******************************************');
    }
  })
});

//  GET FIELD BY ID
router.get('/:id', function (req, res) {
  Field.findOne({ _id: req.params.id }, function (err, field) {
    if (err) res.send(err);
    else {
      res.render('fieldDetail', { field: field });
      console.log('******************************************');
    }
  })
})

//  GET FIELD BY ID RETURN JSON
router.get('/json/:id',function(req,res){
  Field.findOne({_id:req.params.id},function(err,field){
    if(err) res.send(err);
    else{
      if(field){
        res.json(field);
        res.end();
      }
    }
  });
})

//  UPDATE FIELD
router.put('/:id', urlencodedParser, function (req, res) {
  Field.findOne({ $or:[{name: req.body.name},{sname:req.body.sname}], _id:{$ne:req.params.id} }, function (err, field) {
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
              name: req.body.name,
              sName: req.body.sname,
              order:req.body.order
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

//  ADD NEW FIELD
router.post('/', urlencodedParser, function (req, res) {
  Field.findOne({
    $or: [{ name: req.body.name }, { sName: req.body.sname }]
  }, function (err, field) {
    if (err) res.send(err);
    else {
      if (field) {
        res.status(400);
        res.end();
      }
      else {
        var newField = new Field();
        newField.name = req.body.name;
        newField.sName = req.body.sname;
        newField.order = req.body.order;
        newField.save(function (err) {
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

// DELETE FIELD
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

// GET FIELD BY SNAME
router.get('/sname/:sname',function(req,res){
  Field.findOne({sName:req.params.sname},function(err,field){
    if(err) res.send(err);
    else{
      if(field){
        res.json(field);
        res.end();
      }
    }
  });
});
module.exports = router;
