'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var PropValue=new Schema({
    fieldId:{
        type:Schema.Types.ObjectId,
        ref: 'Field'
    },
    value:String
});

var ProfileSchema=new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    detail:[PropValue],
    creTime: {//Time when create this profile
        type: Date,
        default:Date.now
    }
});


module.exports=mongoose.model('Profile',ProfileSchema);