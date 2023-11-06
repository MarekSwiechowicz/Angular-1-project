var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;
var databaseUrl = 'mongodb://localhost:27017/creatourn';
var Promise = require('bluebird');

var users;

module.exports = {
    getUser: getUser,
    createUser: createUser,
    getPaginatedUserList: getPaginatedUserList,
    loginUser: loginUser,
    getManyUsers: getManyUsers,
    getUserByEmail: getUserByEmail
};

async.waterfall([
    function dbConnect(done) {
        MongoClient.connect(databaseUrl, function(err, db) {
            assert.equal(null, err);
            done(null, db);
        });
    },
    function(db, done) {
        users = db.collection('users');
    }
]);

function createUser(user) {
    return new Promise(function(success, reject) {
        users.insert(user, function(err, result) {
            success(result.ops[0]._id);
        });
    });
}

function getUser(id) {
    return new Promise(function(success, reject) {
        users.findOne({
            '_id': ObjectID(id)
        }, function(err, result) {
            success(result);
        });
    });
}



function getPaginatedUserList(query, _from, limit) {
    return users.find({
        "name": {
            $regex: ".*" + query + ".*"
        }
    }, function(err, cursor) {
        return Promise.all([cursor.count(), cursor.skip(_from).limit(limit).toArray()]).then(function(result){
            return {
              amount: result[0],
              users: result[1].map(function(user){
                return {
                  _id: user._id,
                  name: user.name
                };
              })
            };
        });
    });
}


function loginUser(email, password) {
    return new Promise(function(success, reject) {
        users.findOne({
            "email": email,
            "password": password
        }, function(err, result) {
            if (!result || err) {
                reject('wtf');
                return;
            }
            success({
                email: result.email,
                name: result.name,
                _id: result._id
            });
            return;
        });
    });
}

function getUserByEmail(email){
    return new Promise(function(success, reject){
      users.findOne({
          "email": email
      }, function(err, result){
          if(err){
              reject(err);
              return;
          }
          success(result);
      });
    });
}

function getManyUsers(arrID) {
    return users.find({
        '_id': {
            $in: arrID.map(function(id) {
                return ObjectID(id);
            })
        }
    }, function(err, result) {
        if (err) {
            return Promise.reject(err);
        }
        return result.toArray().then(function(arr) {
            return arr.map(function(user) {
                return {
                    _id: user._id,
                    name: user.name
                };
            });
        });
    });
}
