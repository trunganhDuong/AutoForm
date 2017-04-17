var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var flash = require('connect-flash');
var Organization = require('../models/organization.model')
var District = require('../models/district.model');

/* GET organization page. */
router.get('/', function (req, res, next) {
  Organization.find({}, function (err, orgs) {
    if (err) res.send(err);
    else {
      District.find({}, function (err, dists) {
        if (err) res.send(err);
        else {
          res.render('organization', {
            dists: dists,
            orgs: orgs
          });
        }
      });
    }
  });
});

//post new organization
router.post('/', urlencodedParser, function (req, res) {
  Organization.findOne({ name: req.body.name }, function (err, org) {
    if (err) res.send(err);
    else {
      if (org) {
        res.status(400);
        res.end();
      }
      else {
        District.findOne({ name: req.body.district }, function (err, dist) {
          if (err) res.send(err);
          else {
            var newOrg = new Organization();
            newOrg.name = req.body.name;
            newOrg.phone = req.body.phone;
            newOrg.districtId = dist._id;
            newOrg.save(function (err) {
              if (err) res.send(err);
              else {
                res.send(204);
                res.end();
              }
            })
          }
        });
      }
    }
  });
});

//get org by id
router.get('/:id', function (req, res) {
  Organization.findOne({ _id: req.params.id }, function (err, org) {
    if (err) res.send(err);
    else {
      District.findOne({ _id: org.districtId }, function (err, dist) {
        if (err) res.send(err);
        else {
          District.find({}, function (err, dists) {
            if (err) res.send(err);
            else {
              res.render('orgDetail', {
                org: org,
                dist: dist,
                dists:dists
              });
            }
          });

        }
      });
    }
  })
})

//delete org
router.delete('/:id',function(req,res){
  Organization.findByIdAndRemove({_id:req.params.id},function(err){
    if(err) res.send(err);
    else{
      res.status(204);
      res.end();
    }
  });
});

//update org
router.put('/:id',urlencodedParser,function(req,res){
  Organization.findOne({name:req.body.name},function(err,org){
    if(err) res.send(err);
    else{
      District.findOne({name:req.body.district},function(err,dist){
        if(err) res.send(err);
        else{
          Organization.findOneAndUpdate(
            {
              _id:req.params.id
            },
            {
              $set:{
                name:req.body.name,
                phone:req.body.phone,
                districtId:dist._id
              }
            },
            {
              upsert:true
            },
            function(err){
              if(err) res.send(err);
              else{
                res.status(204);
                res.end();
              }
            });
        }
      });
    }
  });
});
module.exports = router;
