'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var ProfileSchema=new Schema({
    accountId: {
        type: Schema.ObjectID,
        ref: 'Account'
    },
    profileName: String,
    creTime: {//Time when create this profile
        type: Date,
        default:Date.now
    }
});


module.exports=mongoose.model('Profile',ProfileSchema);