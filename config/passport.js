var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user.model');
var Admin = require('../models/admin.model');
var configAuth = require('./auth');

// LOCAL STRATEGY 
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //  SIGN UP
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {//  IF EMAIL IS ALREADY USED
                        return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                    } else { // ELSE CREATE A NEW USER WITH GIVEN PARAMETERS
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    //  LOG IN
    passport.use('local-login', new LocalStrategy({
        // NAME OF THE DATA SENT FROM CLIENT
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
        function (req, email, password, done) { //  FIND LOCAL USER BY EMAIL
            User.findOne({ 'local.email': email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user) // IF NO USER FOUND
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password)) // IF PASSWORD IS INVALID
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                return done(null, user);// RETURN THE USER
            });
        }));

    // ADMIN LOG IN
    passport.use('admin-local-login', new LocalStrategy({
        // NAME OF THE DATA SENT FROM CLIENT
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
        function (req, email, password, done) { //  FIND LOCAL USER BY EMAIL
            User.findOne({ 'admin.email': email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user) // IF NO USER FOUND
                    return done(null, false, req.flash('loginMessage', 'User không tồn tại.'));
                if (!user.validAdminPassword(password)) // IF PASSWORD IS INVALID
                    return done(null, false, req.flash('loginMessage', 'Mật khẩu không chính xác.'));
                return done(null, user);// RETURN THE USER
            });
        }));
        
    //  ADMIN SIGN-UP
    passport.use('admin-local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({ 'admin.email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {//  IF EMAIL IS ALREADY USED
                        return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                    } else { // ELSE CREATE A NEW USER WITH GIVEN PARAMETERS
                        var newUser = new User();
                        newUser.admin.email = email;
                        newUser.admin.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};

// FACEBOK STRATEGY
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
},
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {// IF ACCOUNT ALREADY EXISTS => LOG USER IN
                    return done(null, user);
                } else { // IF THERE'S NO SUCH ACCOUNT IN DB => CREATE ONE
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

//  GOOGLE STRATEGY
passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
},
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'google.id': profile.id }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));