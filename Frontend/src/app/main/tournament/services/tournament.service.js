(function() {
  'use strict';

  angular
    .module('app.tournament')
    .service('tournamentService', tournamentService);

  /** @ngInject */
  function tournamentService(msApi, utilsService) {
    var service = this;

    return {
      getTournament: getTournament,
      findTournaments: findTournaments,
      createTournament: createTournament,
      updateTournamentStructure: updateTournamentStructure,
      updateTournament: updateTournament,
      deleteTournament: deleteTournament
    };

    function getTournament(id) {
      return msApi.request('tournament@get', {id: id},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function findTournaments(from, quantity, query, pub, priv) {
      return msApi.request('tournament@query',
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

    function createTournament(tournament) {
      return msApi.request('tournament@save', {tournament: tournament},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function updateTournamentStructure(id, tournament) {
      var tournamentStructure = {
        description: tournament.description,
        moderators: tournament.moderators,
        name: tournament.name,
        private: tournament.private
      };
      return msApi.request('tournament@update', {id: id, tournament: tournamentStructure},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function updateTournament(id, tournament) {
      var tournamentUpdate = {
        players: tournament.players,
        blocks: tournament.blocks
      };
      return msApi.request('tournament@update', {id: id, tournament: tournamentUpdate},
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }

    function deleteTournament(id) {
      return msApi.request('tournament@delete', {id: id},
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