'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
    admin:{
        email:String,
        password:String
    },
    local: {
        email:String,
        password:String,
        creTime:{
            type: Date,
            default: Date.now  
        }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        username: String,
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
    }

});
//  CREATE A HASH
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//  CHECKING IF PASSWORD IS VALID
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

UserSchema.methods.validAdminPassword = function (password) {
    return bcrypt.compareSync(password, this.admin.password);
};

module.exports = mongoose.model('User', UserSchema);