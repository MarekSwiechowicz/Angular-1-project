(function() {
  'use strict';

  angular
    .module('app.template')
    .service('templateService', templateService);

  /** @ngInject */
  function templateService(msApi, utilsService) {
    var service = this;

    return {
      getTemplate: getTemplate,
      findTemplates: findTemplates,
      createTemplate: createTemplate,
      updateTemplate: updateTemplate,
      deleteTemplate: deleteTemplate,
      addToMyTemplates: addToMyTemplates
    };

    function getTemplate(id) {
      return msApi.request('template@get', {id: id},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function findTemplates(from, quantity, query, pub, priv) {
      return msApi.request('template@query',
        {
          from: from,
          quantity: quantity,
          query: query,
          public: pub,
          private: priv
        },
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function createTemplate(template) {
      return msApi.request('template@save', {template: template},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function updateTemplate(id, template) {
      return msApi.request('template@update', {id: id, template: template},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function deleteTemplate(id) {
      return msApi.request('template@delete', {id: id},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function addToMyTemplates(id) {
      return msApi.request('template@add', {id: id},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }
  }
})();
