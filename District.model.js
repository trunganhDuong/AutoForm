'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var DistrictSchema=new Schema({
    name:String,
    cityId: {
        type:Schema.ObjectID,
        ref: 'City'
    }
});


module.exports=mongoose.model('District',DistrictSchema);