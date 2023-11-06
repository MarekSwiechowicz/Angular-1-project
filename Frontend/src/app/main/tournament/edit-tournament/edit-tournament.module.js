(function() {
  'use strict';

    angular
        .module('app.tournament.edit', ['gridster', 'sun.scrollable'])
        .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.tournament_show', {
        url: '/edit-tournament/{tournamentID: [0-9ABCDEFabcdef]+}',
        // url    : '/edit-tournament',
        views: {
          'content@app': {
            templateUrl: 'app/main/tournament/edit-tournament/edit-tournament.html',
            controller: 'TournamentEditController as vm'
          }
        },
        resolve: {}
      }
    );

  // Translation
  //$translatePartialLoaderProvider.addPart('app/main/tournament/edit-tournament');
  }
})();
