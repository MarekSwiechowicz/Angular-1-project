(function ()
{
    'use strict';

    angular
        .module('app.template', ['app.template.list','app.template.edit','app.server-address'])
        .config(config);

    function config(msApiProvider, serverAddressProvider)
    {
        // Api
        var baseAddress = serverAddressProvider.getAddress();

        var templateAddress = baseAddress+'/templates';

        msApiProvider.register('template', [templateAddress+'/:id', {id: '@id'},
        {
            query : { method: 'GET', url : templateAddress, isArray:false},
            save : { method: 'POST', url : templateAddress},
            update : { method: 'PUT'},
            // find: {
            //     method: 'GET', 
            //     url: templateAddress+'?owner=:owner&from=:from&quantity=:quantity&query=:query&public=:public&private=:private',
            //     params: {owner: '@owner', from: '@from', quantity: '@quantity', query: '@query', public: '@public', private: '@private'},
            //     isArray: true
            // },
            delete: {method: 'DELETE'},
            add: { method: 'POST', url : templateAddress+'/addToMyTemplates/:id'},
        }]);
    }
})();
