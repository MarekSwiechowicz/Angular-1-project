var userService = require('../services/users.service');

module.exports = {
    getUser: getUser,
    loginUser: loginUser,
    createUser: createUser,
    getPaginatedUserList: getPaginatedUserList,
    getManyUsers: getManyUsers
};

function isNotValid(id) {
    return !/^[a-fA-F0-9]{24}$/.test(id);
}

function getUser(req, res, next) {
    if (isNotValid(req.params[0])) {
        res.json({
            success: false,
            message: '400 bad id',
            data: null
        });
    }
    userService.getUser(req.params[0]).then(function(data) {
        res.json({
            success: true,
            message: '200',
            data: data
        });
    });
}

function loginUser(req, res, next) {
    userService.loginUser(req.body.email, req.body.password).then(function(data) {
        res.send(data);
    }, function(err) {
        res.send('nie pyklo');
    });
}

function createUser(req, res, next) {
    var newUser = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    };
    userService.createUser(newUser).then(function(data) {
        res.json({
            success: true,
            message: 200,
            data: data
        });
    });
}

function getPaginatedUserList(req, res, next) {
    var query = req.query.query;
    var _from = Number(req.query.from);
    var quantity = Number(req.query.quantity);
    userService.getPaginatedUserList(query, _from, quantity).then(function(data) {
        res.json({
            success: true,
            message: 200,
            data: data
        });
    });
}


function getManyUsers(req, res, next) {
    if (!Array.isArray(req.body.arrID) || req.body.arrID.some(isNotValid)) {
        res.json({
            success: false,
            message: '400 bad id',
            data: null
        });
    }
    userService.getManyUsers(req.body.arrID).then(function(data) {
        res.json({
            success: true,
            message: 200,
            data: data
        });
    }, function(err) {
        res.json({
            success: false,
            message: '400' + err,
            data: null
        });
    });
}
