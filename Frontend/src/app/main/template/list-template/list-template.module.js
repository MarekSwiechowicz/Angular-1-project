(function ()
{
    'use strict';

    angular
        .module('app.template.list', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.template_list', {
            url      : '/list-template',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/template/list-template/list-template.html',
                    controller : 'TemplateListController as vm'
                }
            },
            resolve  : {
            },
            bodyClass: 'template'

        });


        // Translation
        $translatePartialLoaderProvider.addPart('app/main/template/list-template');



        var serverAddress = 'http://localhost:2000/';



        // msApiProvider.register('sample', ['app/data/sample/sample.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('template', {
            title : 'Templates',
            //icon  : 'icon-checkbox-marked',
            state : 'app.template_list',
            badge : {
                content: 1,
                color  : '#009933'
            },
            weight: 1
        });
    }

})();
