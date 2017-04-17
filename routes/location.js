var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var City = require('../models/city.model');
var District = require('../models/district.model');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();


/* GET location page. */
router.get('/', function (req, res, next) {
  City.find({}, function (err, cities) {
    if (err) res.send(err);
    else {
      allCites = cities;
      District.find({}, function (err, districts) {
        if (err) res.send(err);
        else {
          allDistricts = districts;
          res.render('location', { cities: cities, districts: districts });
        }
      })
    }
  });
});

//get city by id
router.get('/city/:id', function (req, res) {
  City.findOne({ _id: req.params.id }, function (err, city) {
    if (err) res.send(err);
    else {
      res.render('cityDetail', { city: city });
      res.end();
    }
  })
})
//delete city
router.delete('/city/:id', function (req, res) {
  City.findOneAndRemove({ _id: req.params.id }, function (err, city) {
    if (err) res.send(err);
    else {
      res.status(204);
      res.end();
    }
  })
})
//update city
router.put('/city/:id',urlencodedParser, function (req, res) {
  City.findOne({ name: req.body.name }, function (err, cit) {
    if (err) res.send(err);
    else {
      if (cit) {
        res.status(400);
        res.end();
      }
      else {
        City.findOneAndUpdate(
          {
            _id: req.params.id
          },
          {
            $set: {name:req.body.name}
          },
          {
            upsert:true
          },
          function (err, city) { 
            if(err) res.send(err);
            else{
              res.status(204);
              res.end();
            }
          });
      }
    }
  });

});


//get district by id
router.get('/district/:id', function (req, res) {
  //Find district
  District.findOne({ _id: req.params.id }, function (err, dist) {
    if (err) res.send(err);
    else {
      if (dist) {
        //Find city
        City.findOne({ _id: dist.cityId }, function (err, cit) {
          if (err) res.send(err);
          else {
            if (cit) {
              //Find all cities
              City.find({}, function (err, cits) {
                if (err) res.send(err);
                else {
                  res.render('districtDetail', {
                    city: cit,
                    cities: cits,
                    district: dist
                  });
                }
              });
            }
            else {
              res.send(404);
              res.end();
            }
          }
        })
      }
      else {
        res.send(404);
        res.end();
      }
    }
  });
})

//update district
router.put('/district/:id',function(req,res){
  District.find({name:req.body.name},function(err,dist){
    if(err) res.send(err);
    else{
      if(dist.length>=2){
        res.status(400);
        res.end();
      }
      else{
        City.findOne({name: req.body.city},function(err,cit){
          if(err) res.send(err);
          else{
            if(!cit){
              res.send(404);
              res.send();
            }
            else{
              District.findOneAndUpdate(
                {
                  _id: req.params.id
                },
                {
                  $set:{
                    name:req.body.name,
                    cityId: cit._id
                  }
                },
                {
                  upsert:true
                },
                function(err,newDist){
                  if(err) res.send(err);
                  else{
                    res.status(204);
                    res.end();
                  }
                });
            }
          }
        });
      }
    }
  });
})

router.delete('/district/:id',function(req,res){
  District.findOneAndRemove({_id:req.params.id},function(err){
    if(err) res.send(err);
    else{
      res.status(204);
      res.end();
    }
  });
});



//Functions handling post request
var newCity = function (req, res) {
  City.findOne({ name: req.body.name }, function (err, city) {
    if (err) res.send(err);
    else {
      if (city) {
        res.status(400);
        res.end();
      }
      else {
        var newCity = new City();
        newCity.name = req.body.name;
        newCity.save(function (err, city) {
          if (err) res.send(err);
          else {
            res.status(204);
            res.end();
          }
        });
      }
    }
  })
}

var newDistrict = function (req, res) {
  //check existence
  District.findOne({ name: req.body.name }, function (err, dist) {
    if (err) res.send(err);
    else {
      if (dist) {
        res.status(400);
        res.end();
      }
      else {
        //Get city id
        City.findOne({ name: req.body.city }, function (err, city) {
          if (err) res.send(err);
          else if (city) {
            console.log(city);
            //post new district
            var newDist = new District();
            newDist.name = req.body.name;
            newDist.cityId = city._id;
            newDist.save(function (err) {
              if (err) res.send(err);
              else {
                res.send(204);
                res.end();
              }
            })
          }
          else {
            res.status(404);
            res.end();
          }
        });
      }
    }
  });
}
router.post('/', urlencodedParser, function (req, res) {
  if (req.body.for === "city") {
    newCity(req, res);
  }
  else {
    newDistrict(req, res);
  }

});

module.exports = router;
