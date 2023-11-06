var passport = require('passport');
var userService = require('../../users/services/users.service');

module.exports = {
  login: login,
  getLoggedUser: getLoggedUser,
  logout: logout,
  createUser: createUser
};

function login(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        success: false,
        error: "Authentication failed",
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        message: '200',
        data: {
          name: user.name,
          email: user.email,
          _id: user._id
        }
      });
    });
  })(req, res, next);
}

function getLoggedUser(req, res, next) {
  if (req.isAuthenticated()) {
    userService.getUser(req.user._id).then(function(user) {
      if (user) {
        res.json({
          success: true,
          message: '200',
          data: {
            _id: user._id,
            email: user.email,
            name: user.name
          }
        });
      } else {
        throw 'error';
      }
    }).catch(function(err) {
      res.json({
        success: false,
        error: "Problem with database"
      });
    });
  } else {
    res.json({
      success: false,
      error: "Authentication failed"
    });
  }
}

function logout(req, res, next) {
  req.logout();
  res.json({
    success: true,
    message: 'User is successfully logged out'
  });
}

function createUser(req, res, next) {
    if(!req.body.name || !req.body.email || !req.body.password){
        res.json({
          success: false,
          error: 'Problem with data'
        });
        return;
    }
    userService.createUser({name: req.body.name, email: req.body.email, password: req.body.password}).then(function(response){
        // if(response!==null){
        //     res.json({
        //         success: true
        //     })
        // }
        // else {
        //     res.json({
        //         success: false,
        //         error: 'User already exists'
        //     })
        // }
        res.json({
          success: true,
          message: '200',
          data: 'User successfully created'
        });
    }).catch(function(err){
        res.json({
          success: false,
          message: '500 Problem with database',
          data: ''
        });
    });
}
