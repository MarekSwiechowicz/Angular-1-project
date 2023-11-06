(function ()
{
    'use strict';

    angular
        .module('app.tournament.list', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.tournament_list', {
            url      : '/list-tournament',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/tournament/list-tournament/list-tournament.html',
                    controller : 'TournamentListController as vm'
                }
            },
            resolve  : {
            },
            bodyClass: 'tournament'

        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/tournament/list-tournament');

        var serverAddress = 'http://localhost:3000/';

        // Navigation
        msNavigationServiceProvider.saveItem('tournament', {
            title : 'Tournaments',
            state : 'app.tournament_list',
            badge : {
                content: 2,
                color  : 'blue'
            },
            weight: 2
        });
    }

})();
