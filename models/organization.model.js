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
    districtId: {
        type: Schema.Types.ObjectId,
        ref: 'District'
    }
});


module.exports=mongoose.model('Organization',OrganizationSchema);