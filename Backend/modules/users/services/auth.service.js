var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userService = require('./users.service');

module.exports = {
  initPassport: initPassport
};

function initPassport() {
  passport.use('local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      userService.getUserByEmail(username).then(function(user) {
        if (!user) {
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }
        if (user.password !== password) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        return done(null, user);
      }).catch(function(err) {
        if (err) {
          console.log(err);
          return done(err);
        }
      });
    }
  ));
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
      userService.getUser(id).then(function(user) {
        done(null, user);
    }).catch(function(err){
        console.log('catch');
        done(err, false);
    });
  });
}
