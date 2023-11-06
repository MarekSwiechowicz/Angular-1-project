var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');

module.exports = {
    getTemplate: getTemplate,
    createTemplate: createTemplate,
    updateTemplate: updateTemplate,
    deleteTemplate: deleteTemplate,
    // getTemplatesPage: getTemplatesPage
    getTemplatesPage: newGetTemplatePage
};

var databaseUrl = 'mongodb://localhost:27017/creatourn';
var db = null;
var templateCollection = null;

// connecting to database
MongoClient.connect(databaseUrl, function(err, database) {
    if (!err) {
        db = database;
        templateCollection = db.collection('templates');
    } else {
        console.error('Database connection error');
    }
});

function getTemplate(id) {
    return new Promise(function(success, reject) {
        templateCollection.findOne({
            '_id': ObjectID(id)
        }, function(err, result) {
            if (err !== null) {
                reject(err);
            }
            success(result);
        });
    });
}

function createTemplate(newTemplate) {
    return new Promise(function(success, reject) {
        templateCollection.insert(newTemplate, function(err, inserted) {
            if (err) {
                reject(err);
            }
            var insertedId = inserted.ops[0]._id;
            success(getTemplate(insertedId));
        });
    });
}

function updateTemplate(id, updatedTemplate) {
    return new Promise(function(success, reject) {
        templateCollection.update({
            '_id': ObjectID(id)
        }, updatedTemplate, function(err, result) {
            if (err) {
                reject(err);
            }
            success(getTemplate(id));
        });
    });
}

function deleteTemplate(id) {
    return new Promise(function(success, reject) {
        templateCollection.remove({
            '_id': ObjectID(id)
        }, function(err, result) {
            if (err) {
                reject(err);
            }
            success();
        });
    });
}


function getTemplatesPage(fromItem, quantity, query, pub, priv, loggedUserId) {

    var result = [];

    var options = {
        'sort': [
            [
                'valid', 'desc'
            ],
            [
                'private', 'desc'
            ],
            [
                'name', 'asc'
            ]
        ]
    };

    var cursor;
    var count;

    return new Promise(function(success, reject) {

        if (pub === 'true' && priv === 'true') {
            cursor = templateCollection.find({
                $or: [{
                    "owner._id": String(loggedUserId)
                }, {
                    private: false
                }],
                "name": {
                    $regex: new RegExp(".*" + query + ".*", "i")
                }
            }, options);
            cursor.count().then(function(size) {
                count = size;
            });
            cursor.skip(fromItem).limit(quantity);
        } else if (pub === 'true' && priv === 'false') {
            cursor = templateCollection.find({
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
            cursor = templateCollection.find({
                "owner._id": String(loggedUserId),
                "name": {
                    $regex: new RegExp(".*" + query + ".*", "i")
                }
            }, options);
            cursor.count().then(function(size) {
                count = size;
            });
            cursor.skip(fromItem).limit(quantity);
        } else {
            reject();
        }

        if (cursor) {
            cursor.toArray().then(function(arr) {
                var result = {};
                result.templateCount = count;
                result.templates = [];

                arr.forEach(function(el) {
                    result.templates.push({
                        '_id': el._id,
                        'name': el.name,
                        'private': el.private,
                        'numberOfPlayers': el.numberOfPlayers,
                        'owner': el.owner,
                        'valid': el.valid
                    });
                });
                success(result);
            });
        } else {
            reject();
        }
    });
}

function newGetTemplatePage(fromItem, quantity, query, pub, priv, loggedUserId) {
    //nowa funkcja umożliwiająca pobieranie najpierw templatow uzytkownika
    //niestety dwa zapytania, ale tak mowili na stackoverflow
    var toMatch = {
        name: {
            $regex: new RegExp(".*" + query + ".*", "i")
        },
        $or: []
    };
    JSON.parse(pub) && toMatch.$or.push({
        private: false
    });
    JSON.parse(priv) && toMatch.$or.push({
        "owner._id": String(loggedUserId)
    });
    var toProject = {
        "name": 1,
        "private": 1,
        "numberOfPlayers": 1,
        "owner": 1,
        "valid": 1
    };
    if(loggedUserId){
      toProject.isOwner = {$eq: ["owner._id", String(loggedUserId)]};
    }else{
      toProject.isOwner = {};
    }
    var toSort = {
        isOwner: 1,
        valid: -1,
        private: 1,
        name: 1
    };
    var amount = templateCollection.aggregate([{
        $match: toMatch
    }, {
        $group: {
            _id: null,
            amount: {
                $sum: 1
            }
        }
    }]).toArray().then(function(result) {
        return result[0].amount;
    });
    var templates = templateCollection.aggregate([{
        $match: toMatch
    }, {
        $project: toProject
    }, {
        $sort: toSort
    }, {
        $skip: fromItem
    }, {
        $limit: quantity
    }]).toArray().then(function(data) {
        return data.map(function(template) {
            delete template.isOwner;
            return template;
        });
    });
    return Promise.all([amount,templates]).then(function(result){
      return {
        templateCount: result[0],
        templates: result[1]
      };
    });
}
