var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var flash = require('connect-flash');
var Organization = require('../models/organization.model')
var District = require('../models/district.model');
var City=require('../models/city.model');

/* GET organization page. */
router.get('/',isLoggedIn, function (req, res, next) {
  Organization.find({}, function (err, orgs) {
    if (err) res.send(err);
    else {
      City.find({},function(err,cities){
        if(err) res.send(err);
        else{
          res.render('organization',{
            cities:cities,
            orgs:orgs
          });
        }
      });
    }
  });
});

// GET ALL ORGS
router.get('/orgs',function(req,res){
  Organization.find({},function(err,cities){
    if(err) res.send(err);
    else{
      res.json(cities);
      res.end();
    }
  });
})

//  POST NEW ORG
router.post('/', urlencodedParser, function (req, res) {
  Organization.findOne({ name: req.body.name }, function (err, org) {
    if (err) res.send(err);
    else {
      if (org) {
        res.status(400);
        res.end();
      }
      else {
        var newOrg=new Organization();
        newOrg.name=req.body.name;
        newOrg.phone=req.body.phone;
        newOrg.districtId=req.body.distId;
        newOrg.cityId=req.body.cityId;
        newOrg.save(function(err){
          if(err) res.send(err);
          else{
            res.status(204);
            res.end();
          }
        })
      }
    }
  });
});

//  GET ORG BY ID
router.get('/:id', function (req, res) {
  Organization.findOne({_id:req.params.id},function(err,org){
    if(err) res.send(err);
    else{
      if(org){
        City.find({},function(err,cities){
          if(err) res.send(err);
          else{
            res.render('orgDetail',{
              org:org,
              cities:cities,
            });
          }
        });
      }
    }
  });
})


//  GET ORG JSON
router.get('/json/:id',function(req,res){
  Organization.findOne({_id:req.params.id},function(err,org){
    if(err) res.send(err);
    else{
      res.json(org);
      res.end();
    }
  });
})

// GET ORG BY DISTRICT ID
router.get('/district/:id', function (req, res) {
  City.findOne({"districts._id":req.params.id},function(err,city){
    if(err) res.send(err);
    else{
      if(city){
        var sub=city.districts.id(req.params.id);
        Organization.find({districtId: sub._id},function(err,orgs){
          if(err) res.send(err);
          else{
            res.json(orgs);
            res.end();
          }
        });
      }
    }
  });
});

// GET ORG BY NAME
router.get('/name/:name', function (req, res) {
  Organization.findOne({ name: req.params.name }, function (err, org) {
    if (err) res.send(err);
    else {
      if (org) {
        res.json(org);
        res.end();
      }
    }
  });
});

//delete org
router.delete('/:id', function (req, res) {
  Organization.findByIdAndRemove({ _id: req.params.id }, function (err) {
    if (err) res.send(err);
    else {
      res.status(204);
      res.end();
    }
  });
});

//  UPDATE ORG
router.put('/:id', urlencodedParser, function (req, res) {
  console.log(req.body);
  Organization.findOne({name:req.body.name, _id:{$ne: req.params.id}},function(err,org){
    if(err) res.send(err);
    else{
      if(org){
        res.status(400);
        res.end();
      }
      else{
        Organization.findOneAndUpdate(
          {
            _id:req.params.id
          },
          {
            $set:{
              name:req.body.name,
              phone:req.body.phone,
              districtId:req.body.districtId,
              cityId:req.body.cityId
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
          }
        );
      }
    }
  })
});

//  CHECK AUTHENTICATION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return next();
  }

  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/admin/index');
  }
}
module.exports = router;
