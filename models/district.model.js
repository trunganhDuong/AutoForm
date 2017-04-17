'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var DistrictSchema=new Schema({
    name:String,
    cityId: {
        type:Schema.Types.ObjectId,
        ref: 'City'
    },
    creTime:{
        type:Date,
        default:Date.now
    }
});


module.exports=mongoose.model('District',DistrictSchema);