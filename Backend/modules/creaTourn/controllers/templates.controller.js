var express = require('express');
var templateService = require('./../services/templates.service');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var async = require('async');
var bodyParser = require('body-parser');

module.exports = {
  getTemplate: getTemplate,
  createTemplate: createTemplate,
  updateTemplate: updateTemplate,
  deleteTemplate: deleteTemplate,
  getTemplatesPage: getTemplatesPage,
  addToMyTemplates: addToMyTemplates
};

var databaseUrl = 'mongodb://localhost:27017/creatourn';


// checks whether all block inputs are non-empty and whether template contains a cycle
function isValidTemplate(template) {
  function returnJson(isValid, message) {
    return {
      isValid: isValid,
      message: message
    };
  }


  // findCycle() variables
  var marked = [];
  var hasCycle = false;
  var onStack = [];

  // isValidTemplate() helper function - checks whether template contains a cycle, v is starting node
  function findCycle(v, template) {
    marked[v] = true;
    onStack[v] = true;
    if (template.blocks && template.blocks[v] && template.blocks[v].output) {
      for (var i = 0; i < template.blocks[v].output.length; i++) {
        var w = template.blocks[v].output[i];
        if (!marked[w]) {
          findCycle(w, template);
        } else if (onStack[w]) {
          hasCycle = true;
          return;
        }
      }
      onStack[v] = false;
    }
  }

  if (!template) {
    return returnJson(false, 'No template');
  }

  findCycle(1, template);
  if (hasCycle) {
    return returnJson(false, "Template has cycle");
  }

  var blocks = template.blocks;

  if (blocks) {
    for (var key in blocks) {
      // skip loop if the property is from prototype
      if (!blocks.hasOwnProperty(key) || blocks[key].type === 'standings') continue;

      if (marked[key] !== true) {
        return returnJson(false, 'Blocks not connected');
      }
    }
  }

  for (var key1 in blocks) {
    if (blocks.hasOwnProperty(key1)) {
      var blockInputs = blocks[key1].inputs;
      // if inputs exist
      if (blockInputs) {
        for (var i = 0; i < blockInputs.length; i++) {
          // if an input is empty or its fields are empty
          if (!blockInputs[i] || !blockInputs[i].idBlock || !blockInputs[i].posInBlock) {
            return returnJson(false, 'Not all inputs are assigned');
          }
        }
      } else {

        // if a block doesn't have inputs and is not a startList nor standings
        if (blocks[key1].type !== 'startList' && blocks[key1].type !== 'standings') {
          return returnJson(false, 'Not all inputs are assigned');
        }
      }
    }
  }
  return returnJson(true, 'Template is valid');
}
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

function getTemplate(req, res, next) {
  var id = req.params.id;
  var loggedUserId;

  // check if there is logged user
  if (req.user) {
    loggedUserId = (String)(req.user._id);
  }

  if (!isValidId(id)) {
    res.send(createResponseJson(false, '400 Invalid id', ''));
    return;
  }
  templateService.getTemplate(id).then(function(data) {
    if (!data) {
      res.send(createResponseJson(false, '404 Not found', ''));
      return;
    }
    // check if user has authorization to get the template
    if (data.private === false || data.owner._id === loggedUserId) {
      res.send(createResponseJson(true, '', data));
      return;
    } else {
      res.send(createResponseJson(false, '403 Unauthorized access', ''));
      return;
    }
  }, function(err) {
    res.send(createResponseJson(false, '500 Database problem ' + err, ''));
    return;
  });
}

function createTemplate(req, res, next) {
  if (!req.body || !req.body.template) {
    res.send(createResponseJson(false, '400 Bad request', ''));
  }
  var newTemplate = req.body.template;

  // if there is no logged user
  if (!req.user) {
    res.send(createResponseJson(false, '401 Unauthorized', ''));
    return;
  }

  newTemplate.owner = {
    name: req.user.name,
    _id: String(req.user._id)
  };

  // log whether template is valid - REMOVE WHEN UNNECESSARY
  console.log('template validation: ' + isValidTemplate(newTemplate).isValid + ' ' + isValidTemplate(newTemplate).message);

  if (isValidTemplate(newTemplate).isValid) {
    newTemplate.valid = true;
  } else {
    newTemplate.valid = false;
  }
  templateService.createTemplate(newTemplate).then(function(data) {
    if (!data) {
      res.send(createResponseJson(false, '404 Not found', ''));
      return;
    }
    res.send(createResponseJson(true, '', data));
    return;
  }, function(err) {
    res.send(false, '500 Database problem ' + err, '');
    return;
  });
}

function updateTemplate(req, res, next) {
  if (!req.params || !req.params.id || !req.body || !req.body.template) {
    res.send(createResponseJson(false, '400 Bad request', ''));
    return;
  }

  var id = req.params.id;
  var updatedTemplate = req.body.template;

  if (!isValidId(id)) {
    res.send(createResponseJson(false, '400 Invalid id', ''));
    return;
  }

  if (isValidTemplate(updatedTemplate).isValid) {
    updatedTemplate.valid = true;
  } else {
    updatedTemplate.valid = false;
  }

  // remove _id if present, it causes database errors
  if (updatedTemplate._id) {
    delete updatedTemplate._id;
  }

  templateService.updateTemplate(id, updatedTemplate).then(function(data) {
    if (!data) {
      res.send(createResponseJson(false, '404 Not found', ''));
      return;
    }
    res.send(createResponseJson(true, '', data));
    return;
  }, function(err) {
    res.send(false, '500 Database problem ' + err, '');
    return;
  });
}

function deleteTemplate(req, res, next) {
  if (!req.params || !req.params.id) {
    res.send(createResponseJson(false, '400 Bad request', ''));
    return;
  }

  var id = req.params.id;

  if (!isValidId(id)) {
    res.send(createResponseJson(false, '400 Invalid id', ''));
    return;
  }

  templateService.deleteTemplate(id).then(function(data) {
    res.send(createResponseJson(true, '', ''));
    return;
  }, function(err) {
    res.send(false, '500 Database problem ' + err, '');
    return;
  });

}

function getTemplatesPage(req, res, next) {
  // if (![req.query.from, req.query.quantity, req.query.public, req.query.private, req.query.query].every(function(el) {
  //     return el;
  //   })) {
  //   res.send(createResponseJson(false, '403 Error', ''));
  //   return;
  // }

  var fromItem = parseInt(req.query.from);
  var quantity = parseInt(req.query.quantity);
  var query = req.query.query;
  var pub = req.query.public;
  var priv = req.query.private;
  var loggedUserId;

  if (!req.user) {
    priv = 'false';
  } else {
    loggedUserId = req.user._id;
  }


  if (pub) {
    if (pub !== 'true' && pub !== 'false') {
      res.send(createResponseJson(false, '400 Bad Request', ''));
    }
  }
  if (priv) {
    if (priv !== 'true' && priv !== 'false') {
      res.send(createResponseJson(false, '400 Bad Request', ''));
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

  templateService.getTemplatesPage(fromItem, quantity, query, pub, priv, loggedUserId).then(function(data) {
    res.send(createResponseJson(true, '', data));
    return;
  }, function(err) {
    res.send(createResponseJson(false, '500 Error', ''));
  });
}

function addToMyTemplates(req, res, next) {
  if (!req.user || !req.user._id) {
    res.send(createResponseJson(false, '401 Unauthorized', ''));
    return;
  }

  var loggedUser = {
    _id: (String)(req.user._id),
    name: req.user.name
  };

  if (!req.params || !req.params.id) {
    res.send(createResponseJson(false, '400 Bad request', ''));
    return;
  }

  var id = req.params.id;

  if (!isValidId(id)) {
    res.send(createResponseJson(false, '400 Invalid id', ''));
    return;
  }

  var template = null;

  templateService.getTemplate(id).then(function(data) {
    if (!data) {
      res.send(createResponseJson(false, '404 Not found', ''));
      return;
    }
    // check if template is public and therefore can be copied
    if (data.private === false) {
      template = data;
      template.owner = loggedUser;
      template.private = true;
      delete template._id;

      templateService.createTemplate(template).then(function(data) {
        if (!data) {
          res.send(createResponseJson(false, '500 Internal error', ''));
          return;
        }
        res.send(createResponseJson(true, '', data));
        return;
      }, function(err) {
        res.send(false, '500 Database problem ' + err, '');
        return;
      });
    } else {
      res.send(false, '400 Template not public', '');
      return;
    }
  }, function(err) {
    res.send(false, '500 Database problem ' + err, '');
    return;
  });
}
