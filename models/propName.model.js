'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var PropNameSchema=new Schema({
    name: String
});


module.exports=mongoose.model('PropName',PropNameSchema);