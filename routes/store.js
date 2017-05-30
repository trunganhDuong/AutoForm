var express = require('express');
var router = express.Router();
var Profile = require('../models/profile.model');
var Store=require('../models/store.model');

/* GET profile page. */
router.get('/', isLoggedIn, function (req, res, next) {
    Profile.find({userId:req.user._id},null,{sort:{name:1}},function(err,profs){
        if(err) res.send(err);
        else{
            if(profs){
                res.render('store',{
                    profs:profs
                });
            }
        }
    });
  
});

//  POST NEW STORE
router.post('/',function(req,res){
    var newStore=new Store();
    newStore.name=req.body.name;
    newStore.formId=req.body.formId;
    newStore.profId=req.body.profId;
    newStore.content=new Buffer(req.body.content);
    newStore.save(function(err){
        if(err) res.send(err);
        else{
            res.status(204);
            res.end();
        }
    });
});

//  GET STORE CONTENT BY ID
router.get('/content/:id',function(req,res){
    Store.findOne({_id:req.params.id},function(err,store){
        if(err) res.send(err);
        else{
            if(store){
                res.json(store.content.toString());
                res.end();
            }
        }
    })
})

//  GET STORE OF A PROFILE
router.get('/profile/:id',function(req,res){
    Store.find({profId:req.params.id},function(err,stores){
        if(err) res.send(err);
        else{
            if(stores){
                res.json(stores);
                res.end();
            }
        }
    });
})



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    req.flash('loginMessage', 'Bạn chưa đăng nhập');
    res.redirect('/');
  }
}
module.exports = router;
