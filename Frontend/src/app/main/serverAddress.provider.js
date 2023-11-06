
(function() {
  'use strict';
  angular
    .module('app.server-address')
    .provider('serverAddress', function() {
      this.$get = function(){
        return {};
      };
      this.getAddress = function(){
        // return 'http://creatourn.vicoop.com:2000';
        return 'http://localhost:2000';
      };
    });

  /** @ngInject */
})();
