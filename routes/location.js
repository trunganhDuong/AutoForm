var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var City = require('../models/city.model');
var District = require('../models/district.model');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();

var allCities;
/* GET location page. */
router.get('/', function (req, res, next) {
  City.find({}, function (err, cities) {
    if (err) res.send(err);
    else {
      allCities = cities;
      res.render('location', {
        cities: cities,
        city: null,
        districts: null
      });
    }
  });
});

//  GET CITY BY ID
router.get('/city/:id', function (req, res) {
  City.findOne({ _id: req.params.id }, function (err, city) {
    if (err) res.send(err);
    else {
      if (city) {
        res.json(city);
        res.end();
      }
      else {
        res.status(400);
        res.end();
      }
    }
  });
})

// GET CITY BY NAME
router.get('/city/name/:name',function(req,res){
  City.findOne({name:req.params.name},function(err,city){
    if(err) res.send(err);
    else{
      if(city){
        res.json(city);
        res.end();
      }
      else{
        res.status(404);
        res.end();
      }
    }
  });
});

//  UPDATE CITY NAME
router.post('/city/name/:id',function(req,res){
  City.findOneAndUpdate(
    {_id:req.params.id},
    {
      $set:{name:req.body.name}
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
    })
})



//  ADD CITY/DISTRICT
router.post('/', function (req, res) {
  var body = req.body;

  if (body.for === 'district') {
    var city = body.city;
    City.findOneAndUpdate(
      {
        name: body.city
      },
      {
        $push: {
          districts: {
            name: body.name
          }
        }
      },
      {
        upsert: true
      },
      function (err) {
        if (err) res.send(err);
        else {
          res.status(204);
          res.end();
        }
      }
    );
  }
  else {
    var newCity = new City();
    newCity.name = req.body.name;
    newCity.save(function (err) {
      if (err) res.send(err);
      else {
        res.status(204);
        res.end();
      }
    });
  }
});

//  DELETE A CITY
router.delete('/:id', function (req, res) {
  City.findOneAndRemove({ _id: req.params.id }, function (err) {
    if (err) res.send(err);
    else {
      res.status(204);
      res.end();
    }
  });
});

//   UPDATE DISTRICT
router.put('/district', function (req, res) {
  City.findOne({"districts.name":req.body.distName},function(err,dist){
    if(err) res.send(err);
    else{
      if(dist){
        res.status(400);
        res.end();
      }
      else{
        City.findOneAndUpdate(
          {"districts._id":req.body.distId},
          {$set:{"districts.$.name":req.body.distName}},
          {upsert:true},
          function(err,dist){
            if(err) res.send(err);
            else{
              console.log(dist);
              res.status(204);
              res.end();
            }
          }
          );
      }
    }
  });
});

//  DELETE DIST
router.delete('/district/:cityId/:distId',function(req,res){
  City.findOneAndUpdate(
    {_id: req.params.cityId},
    {
      $pull:{districts:{_id:req.params.distId}}
    },
    function(err){
      if(err) res.send(err);
      else{
        res.status(204);
        res.end();
      }
    }
  );
});

module.exports = router;
