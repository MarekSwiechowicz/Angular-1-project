(function() {
  'use strict';

  angular
    .module('app.template.edit', ['gridster'])
    .config(config)
    .filter('toArray', function () {
  return function (obj, addKey) {
    if (!(obj instanceof Object)) {
      return obj;
    }

    if ( addKey === false ) {
      return Object.values(obj);
    } else {
      return Object.keys(obj).map(function (key) {
        return Object.defineProperty(obj[key], '$key', { enumerable: false, value: key});
      });
    }
  };
});

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.template_edit', {
        url: '/edit-template/{templateID: [0-9abcdefABCDEF]*}',
        views: {
          'content@app': {
            templateUrl: 'app/main/template/edit-template/edit-template.html',
            controller: 'TemplateEditController as vm'
          }
        },
        data: {
            edit: true
        },
        resolve: {}
      });
    $stateProvider
      .state('app.template_show', {
        url: '/show-template/{templateID: [0-9abcdefABCDEF]+}',
        views: {
          'content@app': {
            templateUrl: 'app/main/template/edit-template/edit-template.html',
            controller: 'TemplateEditController as vm'
          }
        },
        data : {
            edit: false
        },
        resolve: {}
      });
  }
})();
