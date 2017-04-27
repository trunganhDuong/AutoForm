'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var FormSchema=new Schema({
    name: String,
    creTime:{
        type: Date,
        default: Date.now
    },
    content: Buffer,
    orgId:{
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }
});


module.exports=mongoose.model('Form',FormSchema);