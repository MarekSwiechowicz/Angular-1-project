(function ()
{
    'use strict';

    angular
        .module('app.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, msApiProvider, serverAddressProvider)
    {
        // State
        $stateProvider.state('app.auth_login', {
            url      : '/auth/login',
            views    : {
                // 'main@'                       : {
                //     templateUrl: 'app/core/layouts/content-only.html',
                //     controller : 'MainController as vm'
                // },
                // 'content@app.auth_login: {'
                'content@app': {
                    templateUrl: 'app/main/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login'
        });
        var serverAddress=serverAddressProvider.getAddress();
        msApiProvider.register('authlogin', [serverAddress + '/auth/login']);
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/auth/login');

        // Navigation
        // msNavigationServiceProvider.saveItem('auth', {
        //     title : 'Authentication',
        //     icon  : 'icon-lock',
        //     weight: 1
        // });
        //
        // msNavigationServiceProvider.saveItem('auth.login', {
        //     title : 'Login',
        //     state : 'app.auth_login',
        //     weight: 1
        // });
    }

})();
