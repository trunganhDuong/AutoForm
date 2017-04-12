'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var AccountSchema=new Schema({
    email: {
        type:String,
        unique:true
    },
    username:{
        type: String,
        unique: true
    },
    password:String,
    creTime:{
        type: Date,
        default:Date.now
    },
    type:String
});


module.exports=mongoose.model('Account',AccountSchema);