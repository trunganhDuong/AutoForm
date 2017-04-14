'use strict';

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var FieldSchema=new Schema({
    name:{
        type:String,
        unique:true
    },
    creTime:{
        type: Date,
        default: Date.now
    }
});
module.exports= mongoose.model('Field',FieldSchema);