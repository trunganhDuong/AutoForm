'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var DistrictSchema=new Schema({
    name:String,
    creTime:{
        type:Date,
        default:Date.now
    }
});


module.exports=mongoose.model('District',DistrictSchema);