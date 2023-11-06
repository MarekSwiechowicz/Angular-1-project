(function() {
  'use strict';

  angular
    .module('fuse')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $timeout, $state, AuthService) {
    // Activate loading indicator
    var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      $rootScope.loadingProgress = true;
      function guestRouting() {
        var dontAllowToEdit = /^(.*)_edit$/;
        if (dontAllowToEdit.test(toState.name)) {
          $state.go(toState.name.split(dontAllowToEdit).join('') + '_list');
        }
        var dontAllowArray = ['app.auth_login'];
        if(dontAllowArray.indexOf(toState.name)!== -1){
          $state.go('app.tournament_list');
        }
      }
      function loggedRouting() {
        var dontAllowArray = ['app.auth_register','app.auth_login'];
        if (dontAllowArray.indexOf(toState.name) !== -1) {
          if ($state.current.name === '') {
            $state.go('app.tournament_list');
          } else {
            $state.go($state.current.name);
          }
        }
      }
      if (toState.name !== '') {                   //odkomentowac, zeby wlaczyc routing
        if (!AuthService.isLogged()) {
          AuthService.getLoggedUser().then(function(logged) {
            loggedRouting();
          }, function(notLogged) {
            guestRouting();
          })
        } else {
          loggedRouting();
        }
      }
    });

    // De-activate loading indicator
    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        $rootScope.loadingProgress = false;
      });
    });

    // Store state in the root scope for easy access
    $rootScope.state = $state;

    // Cleanup
    $rootScope.$on('$destroy', function() {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
    });
  }
})();
