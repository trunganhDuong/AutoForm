'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var FormSchema=new Schema({
    name: String,
    creTime:{
        tyep: Date,
        def: Date.now
    },
    content: Buffer,
    orgId:{
        type: Schema.ObjectId,
        ref: 'Organization'
    }
});


module.exports=mongoose.model('Form',FormSchema);