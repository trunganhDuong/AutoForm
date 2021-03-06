var express = require('express');
var router = express.Router();
var Profile = require('../models/profile.model');
var Field = require('../models/field.model');

/* GET profile page. */
router.get('/', isLoggedIn, function (req, res, next) {
  Field.find({},null,{sort:{order:1}}, function (err, fields) {
    if (err) res.send(err);
    else {
      Profile.find({ userId: req.user._id },null,{sort:{name:1}} ,function (err, profs) {
        if (err) res.send(err);
        else {
          res.render('profile', {
            profs: profs,
            fields: fields
          });
        }
      });
    }
  });
});

//  GET PROFILE BY ID
router.get('/:id', function (req, res) {
  Profile.findOne({ _id: req.params.id }, function (err, prof) {
    if (err) res.send(err);
    else {
      if (prof) {
        res.json(prof);
        res.end();
      }
    }
  })
});

//  ADD NEW PROFILE
router.post('/',isLoggedIn, function (req, res) {
  Profile.findOne({userId:req.user._id, name: req.body.profName }, function (err, prof) {
    if (err) res.send(err);
    else {
      if (prof) {
        res.status(400);
        res.end();
      }
      else {
        var newProf = new Profile();
        newProf.userId = req.user._id;
        newProf.name = req.body.profName;
        newProf.save(function (err) {
          if (err) res.send(err);
          else {
            res.status(204);
            res.end();
          }
        })
      }
    }
  });
});

//  DELETE PROFILE
router.delete('/:id',isLoggedIn, function (req, res) {
  Profile.findByIdAndRemove(req.params.id, function (err) {
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

//  UPDATE PROFILE
router.put('/',isLoggedIn, function (req, res) {
  // CLEAR PREVIOUS DATA
  Profile.findOneAndUpdate(
    {
      _id: req.body.profId
    },
    {
      $set: { detail: [] }
    },
    {
      upsert: true
    },
    function (err) {
      if (err) res.send(err);
      else {
        //  INSERT DATA FROM CLIENT
        var detail = JSON.parse(req.body.detail);
        Profile.findOneAndUpdate(
          {
            _id: req.body.profId
          },
          {
            $set:{name: req.body.profName},
            $pushAll: { detail: detail }
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
    }
  );
  

});

//  GET ALL PROFILES EXCEPT
router.get('/except/:id',function(req,res){
  Profile.find({userId:req.user._id, _id:{$ne:req.params.id}},null,{sort:{name:1}},function(err,profs){
    if(err) res.send(err);
    else{
      res.json(profs);
      res.end();
    }
  });
})
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()&& !req.user.admin.email)
    return next();
  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/');
  }
}
module.exports = router;
