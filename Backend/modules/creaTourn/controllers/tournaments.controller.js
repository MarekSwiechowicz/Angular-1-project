var express = require('express');
var tournamentService = require('./../services/tournaments.service');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var async = require('async');
var bodyParser = require('body-parser');

module.exports = {
    getTournament: getTournament,
    createTournament: createTournament,
    getTournamentsPage: getTournamentsPage,
    deleteTournament: deleteTournament,
    updateTournament: updateTournament
};

var databaseUrl = 'mongodb://localhost:27017/creatourn';

function isValidId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

function createResponseJson(success, message, data) {
    return {
        'success': success,
        'message': message,
        'data': data
    };
}

function getTournament(req, res, next) {
    var id = req.params.id;
    if(!isValidId(id)){
      res.send(createResponseJson(false, '400 Invalid id', ''));
    }
    tournamentService.getTournament(id).then(function(data){
      res.send(createResponseJson(true, '', data));
    });
}

function createTournament(req, res, next) {
    var templateId = req.body.tournament.template._id;

    async.waterfall([
        function dbConnect(done) {
            MongoClient.connect(databaseUrl, function(err, db) {
                assert.equal(null, err);
                done(null, db);
            });
        },
        function(db, done) {
            db.collection('templates').findOne({
                '_id': ObjectID(templateId)
            }, function(err, result) {
                if (err) {
                    res.send(createResponseJson(false, '500 ' + err, ''));
                }
                if (!result) {
                    res.send(createResponseJson(false, '404 Template Not Found', ''));
                } else {
                    done(null, db, result);
                }
            });
        },
        function(db, template, done) {
            var tournReq = req.body.tournament;
            template.template = {
                name: template.name,
                _id: template._id
            };
            template.type = 'tournament';
            template.name = tournReq.name;
            delete template._id;
            template.private = tournReq.private;
            template.owner = {
                name: req.user.name,
                _id: String(req.user._id)
            };
            template.description = tournReq.description;
            template.moderators = tournReq.moderators;
            done(null, db, template);
        },
        function(db, tournament, done) {
            db.collection('tournaments').insert(tournament, function(err, inserted) {
                if (err) {
                    res.send(500);
                } else {
                    var insertedId = inserted.ops[0]._id;
                    done(null, db, insertedId);
                }
            });
        },
        function(db, insertedId, done) {
            db.collection('tournaments').findOne({
                '_id': ObjectID(insertedId)
            }, function(err, result) {
                if (err) {
                    res.send(createResponseJson(false, '500 ' + err, ''));
                }
                if (!result) {
                    res.send(createResponseJson(false, '404 ' + err, ''));
                } else {
                    res.send(createResponseJson(true, '', result));
                    done(null, res);
                }
            });
        }
    ], function(err, result) {
        assert.equal(null, err);
    });
}

function getTournamentsPage(req, res, next) {

    var fromItem = parseInt(req.query.from);
    var quantity = parseInt(req.query.quantity);
    var query = req.query.query;
    var pub = req.query.public;
    var priv = req.query.private;

    var participate = req.user ? [{
        "owner._id": String(req.user._id)
    }, {
        "moderators._id": String(req.user._id)
    }, {
        "players._id": String(req.user._id)
    }] : [];


    if (pub) {
        if (pub !== 'true' && pub !== 'false') {
            res.send(createResponseJson(false, '400 Bad Request', ''));
            return;
        }
    }
    if (priv) {
        if ((priv !== 'true' && priv !== 'false')) {
            res.send(createResponseJson(false, '400 Bad Request', ''));
            return;
        }
    }
    if (!query) {
        query = '';
    }
    if (!fromItem) {
        fromItem = 0;
    }
    if (!quantity) {
        quantity = Number.MAX_SAFE_INTEGER;
    }

    if (!req.user) {
        priv = 'false';
    }

    async.waterfall([
            function dbConnect(done) {
                MongoClient.connect(databaseUrl, function(err, db) {
                    assert.equal(null, err);
                    done(null, db);
                });
            },
            function(db, done) {
                var result = [];

                var options = {
                    'sort': [
                        [
                            'private', 'desc'
                        ],
                        [
                            'valid', 'asc'
                        ],
                        [
                            'name', 'asc'
                        ]
                    ]
                };

                var cursor;
                var count;

                if (pub === 'true' && priv === 'true') {
                    cursor = db.collection('tournaments').find({
                            $or: req.user ? participate.slice(0).concat([{"private": false}]) : [{"private": false}],
                            "name": {
                                $regex: new RegExp(".*" + query + ".*", "i")
                            }
                        },
                        options);
                    cursor.count().then(function(size) {
                        count = size;
                    });
                    cursor.skip(fromItem).limit(quantity);
                } else if (pub === 'true' && priv === 'false') {
                    cursor = db.collection('tournaments').find({
                        private: false,
                        "name": {
                            $regex: new RegExp(".*" + query + ".*", "i")
                        }
                    }, options);
                    cursor.count().then(function(size) {
                        count = size;
                    });
                    cursor.skip(fromItem).limit(quantity);
                } else if (pub === 'false' && priv === 'true') {
                    cursor = db.collection('tournaments').find({
                        $or: participate,
                        "name": {
                            $regex: new RegExp(".*" + query + ".*", "i")
                        }
                    }, options);
                    cursor.count().then(function(size) {
                        count = size;
                    });
                    cursor.skip(fromItem).limit(quantity);
                } else {
                    res.send(createResponseJson(false, '400 Bad Request', ''));
                    return;
                }

                if (cursor) {
                    cursor.toArray().then(function(arr) {
                        var result = {};
                        result.tournamentCount = count;
                        result.tournaments = [];

                        arr.forEach(function(el) {
                            result.tournaments.push({
                                '_id': el._id,
                                'name': el.name,
                                'private': el.private,
                                'numberOfPlayers': el.numberOfPlayers,
                                'owner': el.owner,
                                'template': el.template,
                                'description': el.description,
                                'role': req.user ? {
                                    owner: String(req.user._id) === String(el.owner._id),
                                    moderator: el.moderators.some(function(mod) {
                                        return String(req.user._id) === String(mod._id);
                                    }),
                                    player: el.players.some(function(player) {
                                        return player ? String(req.user._id) === String(player._id) : false;
                                    })
                                } : {
                                    owner: false,
                                    moderator: false,
                                    player: false
                                }
                            });
                        });
                        done(null, result);
                    });
                }

            },
            function(result, done) {
                if (!result) {
                    res.send(createResponseJson(false, '404', ''));
                } else {
                    res.send(createResponseJson(true, '', result));
                }
                done(null, result);
            }
        ],
        function(err, result) {
            assert.equal(null, err);
        });
}

function deleteTournament(req, res, next) {
    var id = req.params.id;

    async.waterfall([
        function dbConnect(done) {
            MongoClient.connect(databaseUrl, function(err, db) {
                assert.equal(null, err);
                done(null, db);
            });
        },
        function(db, done) {
            db.collection('tournaments').remove({
                '_id': ObjectID(id)
            }, function(err, result) {
                if (err) {
                    res.send(createResponseJson(false, '500 ' + err, ''));
                }
                if (!result) {
                    res.send(createResponseJson(false, '404 ' + err, ''));
                } else {
                    res.send(createResponseJson(true, '', ''));
                }
                done(null, result);
            });
        }
    ], function(err, result) {
        assert.equal(null, err);
    });
}

function updateTournament(req, res, next) {
    var newTournament = req.body.tournament;
    var id = req.params.id;

    if (newTournament) {
        delete newTournament._id;
    }

    async.waterfall([
        function dbConnect(done) {
            MongoClient.connect(databaseUrl, function(err, db) {
                assert.equal(null, err);
                done(null, db);
            });
        },
        function(db, done) {
            db.collection('tournaments').update({
                '_id': ObjectID(id)
            }, {
                $set: req.body.tournament
            }, function(err, result) {
                if (err) {
                    res.send(createResponseJson(false, '500 ' + err, ''));
                } else if (!result) {
                    res.send(createResponseJson(false, '404 ' + err, ''));
                } else {
                    db.collection('tournaments').findOne({
                        '_id': ObjectID(id)
                    }, function(err, result) {
                        if (err) {
                            res.send(createResponseJson(false, '500 ' + err, ''));
                        }
                        if (!result) {
                            res.send(createResponseJson(false, '404 ' + err, ''));
                        } else {
                            res.send(createResponseJson(true, '', result));
                        }
                    });
                    done(null, result);
                }
            });
        }
    ], function(err, result) {
        assert.equal(null, err);
    });
}
