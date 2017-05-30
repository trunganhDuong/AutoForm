'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoreSchema = new Schema({
    name:String,
    profId: Schema.Types.ObjectId,
    formId: Schema.Types.ObjectId,
    creTime:{
        type: Date,
        default:Date.now
    },
    content:Buffer
    
});
module.exports = mongoose.model('Store', StoreSchema);