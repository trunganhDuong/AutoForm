'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var OrganizationSchema=new Schema({
    name: String,
    regTime: {
        type: Date,
        default: Date.now
    },
    phone: Array,
    districtID: {
        type: Schema.ObjectID,
        ref: 'District'
    }
});


module.exports=mongoose.model('Organization',OrganizationSchema);