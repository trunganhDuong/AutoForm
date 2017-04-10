'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var AccountSchema=new Schema({
    email: String,
    username:String,
    password:String,
    creTime:{
        type: Date,
        ref:Date.now
    }
});


module.exports=mongoose.model('Account',AccountSchema);