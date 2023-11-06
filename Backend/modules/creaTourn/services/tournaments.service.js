var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var templateService = require('./templates.service.js');
var Promise=require('bluebird');


module.exports = {
    getTournament: getTournament,
    createTournament: createTournament
};

var databaseUrl = 'mongodb://localhost:27017/creatourn';
var db = null;
var tournamentCollection = null;

// connecting to database
MongoClient.connect(databaseUrl, function(err, database) {
    if (!err) {
        db = database;
        tournamentCollection = db.collection('tournaments');
    } else {
        console.error('Database connection error');
    }
});

function getTournament(id) {
    return new Promise(function(success, reject) {
        tournamentCollection.findOne({
            '_id': ObjectID(id)
        }, function(err, result) {
            if(err){
              reject(err);
              return;
            }
            success(result);
        });
    });
}

function createTournament(newTournament) {
    return new Promise(function(success, reject) {
        tournamentCollection.insert(newTournament, function(err, inserted) {
            if (err) {
                reject(err);
            }
            var insertedId = inserted.ops[0]._id;
            success(getTournament(insertedId));
        });

    });
}
