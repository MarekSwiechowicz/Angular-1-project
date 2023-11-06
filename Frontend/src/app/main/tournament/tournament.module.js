(function ()
{
    'use strict';

    angular
        .module('app.tournament', ['app.tournament.list','app.tournament.edit','app.server-address'])
        .config(config);

    function config(msApiProvider, serverAddressProvider)
    {
        // Api
        var baseAddress = serverAddressProvider.getAddress();

        var tournamentAddress = baseAddress+'/tournaments';

        msApiProvider.register('tournament', [tournamentAddress+'/:id', {id: '@id'},
        {
            query : { method: 'GET', url : tournamentAddress, isArray:false},
            save : { method: 'POST', url : tournamentAddress},
            update : { method: 'PUT'},
            // findConnected: {
            //     method: 'GET', 
            //     url: tournamentAddress+'/findConnected/:id',
            //     params: {id: '@id'},
            //     isArray: false
            // }
        }]);
    }
})();