(function() {
  'use strict';

  angular
    .module('app.auth')
    .service('AuthService', AuthService);

  /** @ngInject */
  function AuthService(msApi, $http, $q, $mdToast, $mdDialog, $timeout, serverAddressService, tournamentService, utilsService) {
    var service = this;
    service.login = login;
    service.register = register;
    service.logout = logout;
    service.getLoggedUser = getLoggedUser;
    service.loggedUser = null;
    service.isLogged = function() {
      return !!service.loggedUser;
    };

    function login(email, password) {
      return msApi.request('authlogin@save', {
        username: email,
        password: password
      }).then(function(response) {
        if (response.success===false) {
          service.loggedUser=null;
            utilsService.showToast('Wrong e-mail or password!');
            return false;
        }
        else{
          service.loggedUser = response.data;
          return true;
        }
      });
    }
    // vertical-align: middle; line-height: 50px;

    function register(name, email, password) {
      return msApi.request('authregister@save', {
        name: name,
        email: email,
        password: password
      });

    }

    function logout() {
      return $http({
        url: serverAddressService.getAddress()+'/auth/logout',
        method: 'GET'
      }).then(function(data) {
        service.loggedUser = null;
        return true;
      })

    }

    function getLoggedUser() {
      return $http({
        url: serverAddressService.getAddress()+'/auth/getuser',
        method: 'GET'
      }).then(function(response) {
        var data = response.data;
        if (data.success) {
          service.loggedUser = data.data;
          return data.data;
        } else {
          return $q.reject();
        }
      });
    }
}

})();
