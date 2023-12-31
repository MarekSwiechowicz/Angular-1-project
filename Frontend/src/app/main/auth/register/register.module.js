(function ()
{
    'use strict';

    angular
        .module('app.auth.register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, msApiProvider, serverAddressProvider)
    {
        // State
        $stateProvider.state('app.auth_register', {
            url      : '/auth/register',
            views    : {
                // 'main@'                          : {
                //     templateUrl: 'app/core/layouts/content-only.html',
                //     controller : 'MainController as vm'
                // },
                // 'content@app.auth_register': {
                'content@app': {
                    templateUrl: 'app/main/auth/register/register.html',
                    controller : 'RegisterController as vm'
                }
            },
            bodyClass: 'register'
        });
        var serverAddress=serverAddressProvider.getAddress();
        msApiProvider.register('authregister', [serverAddress + '/auth/register']);


        // Translation
        $translatePartialLoaderProvider.addPart('app/main/auth/register');

        // Navigation
        // msNavigationServiceProvider.saveItem('auth.register', {
        //     title : 'Register',
        //     state : 'app.auth_register',
        //     weight: 3
        // });
    }

})();
