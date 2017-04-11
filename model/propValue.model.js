'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var PropValueSchema=new Schema({
    profId:{
        type: Schema.ObjectId,
        ref:'Profile'
    },
    propId:{
        type: Schema.ObjectId,
        ref:'PropName'
    },
    value: String

});


module.exports=mongoose.model('PropValue',PropValueSchema);