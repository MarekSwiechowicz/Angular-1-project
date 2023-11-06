(function ()
{
    'use strict';

    angular
        .module('app.user', [])
        .config(config);

    function config(msApiProvider, serverAddressProvider)
    {
        // Api
        var baseAddress = serverAddressProvider.getAddress();

        var userAddress = baseAddress+'/user';

        msApiProvider.register('user', [userAddress+'/:id', {id: '@id'},
        {
            query : {method: 'GET', url : userAddress+'/list', isArray:false}
        }]);
    }

})();
