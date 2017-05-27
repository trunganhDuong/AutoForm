'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FieldSchema = new Schema({
    name: String,
    sName: String,
    order:Number,
    creTime: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Field', FieldSchema);