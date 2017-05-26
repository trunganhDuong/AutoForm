var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencondedParser = bodyParser.urlencoded({
  extended: true
});

var Form = require('../models/form.model');
var Organization = require('../models/organization.model');
var City = require('../models/city.model');
var District = require('../models/district.model');

/* GET form management page. */
router.get('/', function (req, res, next) {
  Organization.find({}, function (err, orgs) {
    if (err) res.send(err);
    else {
      Form.find({}, function (err, forms) {
        if (err) res.send(err);
        else {
          City.find({}, function (err, cities) {
            if (err) res.send(err);
            else {
              res.render('form', {
                orgs: orgs,
                forms: forms,
                cities: cities
              })
            }
          });

        }
      });

    }
  })
});

// POST NEW FORM
router.post('/', urlencondedParser, function (req, res) {
  //Check existence
  /*Form.findOne({name:req.body.name},function(err,form){
    if(err) res.send(err);
    else{
      if(form){
        res.status(400);
        res.end();
      }
      else{
        Organization.findOne({name:req.body.org},function(err,org){
          if(err) res.send(err);
          else{
            fs.readFile('./public/forms/'+req.body.file,function(err,data){
              if(err) res.send(err);
              else{
                var newForm=new Form();
                newForm.name=req.body.name;
                newForm.orgId=org._id,
                newForm.content=data;
                
                newForm.save(function(err){
                  if(err) res.send(err);
                  else{
                    res.status(204);
                    res.end();
                  }
                });
              }
            })
          }
        })
      }
    }
  })*/
  if (req.body.for === 'search') {
    Organization.find({}, function (err, orgs) {
      if (err) res.send(err);
      else {
        City.find({}, function (err, cities) {
          if (err) res.send(err);
          else {
            res.render('form', {
              orgs: orgs,
              forms: req.body.forms,
              cities: cities
            })
          }
        });
      }
    })
  }
  else {
    Organization.findOne({ name: req.body.org }, function (err, org) {
      if (err) res.send(err);
      else {
        fs.readFile('./public/forms/' + req.body.file, function (err, data) {
          if (err) res.send(err);
          else {
            var newForm = new Form();
            newForm.name = req.body.name;
            newForm.orgId = org._id,
              newForm.content = data;

            newForm.save(function (err) {
              if (err) res.send(err);
              else {
                res.status(204);
                res.end();
              }
            });
          }
        })
      }
    })
  }

});

// GET PARTICULAR FORM BY ID
router.get('/:id', function (req, res) {
  Form.findOne({ _id: req.params.id }, function (err, form) {
    if (err) res.send(err);
    else {
      res.send(form.content.toString());
      res.end();
    }
  });
});

//  GET ORGID OF A FORM
router.get('/org/id/:formId',function(req,res){
  Form.findOne({_id:req.params.formId},function(err,form){
    if(err) res.send(err);
    else{
      if(form){
        res.send(form.orgId);
        res.end();
      }
    }
  })
})

//  UPDATE FORM
router.put('/', urlencondedParser, function (req, res) {
  var buffer = new Buffer(req.body.content);
  Form.findOneAndUpdate(
    {
      _id: req.body.formId
    },
    {
      $set: {
        content: buffer
      }
    },
    {
      upsert: true
    },
    function (err) {
      if (err) {
        res.send(err);
        res.status(500);
        res.end();
      }
      else {
        res.status(204);
        res.end();
      }
    });
})

//  DELETE FORM
router.delete('/', function (req, res) {
  Form.findOneAndRemove({ _id: req.body.formId }, function (err) {
    if (err) {
      res.send(err);
      res.status(400);
      res.end();
    }
    else {
      res.status(204);
      res.end();
    }
  });
});

// GET ALL FORMS OF AN ORG
router.get('/org/:id', function (req, res) {
  Form.find({ orgId: req.params.id }, function (err, forms) {
    if (err) res.send(err);
    else {
      if (forms) {
        res.json(forms);
        res.end();
      }
      else {
        res.status(404);
        res.end();
      }
    }
  });
})

// GET ALL FORMS OF SELECTED ORGS
router.post('/orgs', function (req, res) { 
  console.log(req.body.orgs);
  /*Form.find(
    {
      orgId: { $in: req.body.orgIds }
    }, function (err, forms) {
      if (err) res.send(err);
      else {
        if (forms) {
          res.json(forms);
          res.end();
        }
        else {
          res.status(400);
          res.end();
        }

      }
    });*/
});



module.exports = router;
