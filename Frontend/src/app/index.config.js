(function() {
  'use strict';

  angular
    .module('fuse')
    .config(config);

  /** @ngInject */
  function config($httpProvider) {
    // Put your custom configurations here
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.withCredentials = true;

    var interceptor = [
      function() {

        var service = {

          // run this function before making requests
          'request': function(config) {
              config.withCredentials=true;
              return config;
          }

        };

        return service;

      }
    ];

    $httpProvider.interceptors.push(interceptor);
  }

})();
