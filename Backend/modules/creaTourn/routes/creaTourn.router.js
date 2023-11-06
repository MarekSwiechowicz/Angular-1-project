var express = require('express');

var creaTournRouter = express.Router();

module.exports = creaTournRouter;

var templatesController = require('./../controllers/templates.controller');
var tournamentsController = require('./../controllers/tournaments.controller');

creaTournRouter.get('/templates/:id', templatesController.getTemplate);
creaTournRouter.get('/templates', templatesController.getTemplatesPage);
creaTournRouter.post('/templates', templatesController.createTemplate);
creaTournRouter.put('/templates/:id', templatesController.updateTemplate);
creaTournRouter.delete('/templates/:id', templatesController.deleteTemplate);
creaTournRouter.post('/templates/addtomytemplates/:id', templatesController.addToMyTemplates);

creaTournRouter.get('/tournaments/:id', tournamentsController.getTournament);
creaTournRouter.get('/tournaments', tournamentsController.getTournamentsPage);
creaTournRouter.post('/tournaments', tournamentsController.createTournament);
creaTournRouter.put('/tournaments/:id', tournamentsController.updateTournament);
creaTournRouter.delete('/tournaments/:id', tournamentsController.deleteTournament);
