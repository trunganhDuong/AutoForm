'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var AdminSchema = new Schema({
    email: String,
    password: String,
});
//  CREATE A HASH
AdminSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//  CHECKING IF PASSWORD IS VALID
AdminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);