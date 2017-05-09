'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;


var OrganizationSchema=new Schema({
    name: String,
    creTime: {
        type: Date,
        default: Date.now
    },
    phone: Array,
    districtId:Schema.Types.ObjectId
});


module.exports=mongoose.model('Organization',OrganizationSchema);