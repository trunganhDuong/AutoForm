'use strict';

var mongoose = require('mongoose')
var Schema=mongoose.Schema;

var EventLogSchema=new Schema({
    accId:{
        type:Schema.ObjectId,
        ref:'Account'
    },
    target: String,
    action: String,
    time: {
        tyep: Date,
        ref: Date.now
    }

});


module.exports=mongoose.model('EventLog',EventLogSchema);