var express = require('express');
var authRouter = express.Router();
var authController = require('../controllers/auth.controller');

module.exports = authRouter;

authRouter.post(/^\/auth\/register$/, authController.createUser);
authRouter.post(/^\/auth\/login$/, authController.login);
authRouter.get(/^\/auth\/logout$/, authController.logout);
authRouter.get(/^\/auth\/getuser$/, authController.getLoggedUser);
