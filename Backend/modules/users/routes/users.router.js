var express = require('express');
var userRouter = express.Router();
var userController = require('../controllers/users.controller');

module.exports = userRouter;

userRouter.get(/^\/user\/getuser\/([0-9ABCDEFabcdef]+)$/, userController.getUser);
userRouter.get('/user/list', userController.getPaginatedUserList);
userRouter.post(/^\/loginuser$/, userController.loginUser);
userRouter.post(/^\/user\/getmany$/, userController.getManyUsers);
