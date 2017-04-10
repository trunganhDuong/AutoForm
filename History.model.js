'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var HistorySchema=new Schema({
    profId:{
        type:Schema.ObjectId,
        ref: 'Profile'
    },
    formId:{
        type: Schema.ObjectId,
        ref: 'Form'
    },
    fillTime:{
        type: Date,
        default: Date.now
    }
});


module.exports=mongoose.model('History',HistorySchema);