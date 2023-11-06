(function() {
  'use strict';

  /** @ngInject */
  angular
    .module('app.server-address')
    .service('serverAddressService', serverAddressService);


    function serverAddressService() {
      var service=this;
      service.getAddress = function(){
        // return 'http://creatourn.vicoop.com:2000';
        return 'http://localhost:2000';
      };
      return service;
    }


})();
