(function() {
  'use strict';

  angular
    .module('app.user')
    .service('userService', UserService);

  /** @ngInject */
  function UserService(msApi, utilsService, AuthService) {
    var service = this;

    return {
      findUsers: findUsers,
      getRoles: getRoles,
      isOwner: isOwner
    };

    function findUsers(from, quantity, query) {
      return msApi.request('user@query',
        {
          from: from,
          quantity: quantity,
          query: query
        },
        function(response) {},
        function(response) {
          console.error(response);
          utilsService.showDatabaseProblem();
        }).then(function(response) {
        return response;
      });
    }
    

    function getRoles(tournament){
      return AuthService.loggedUser ? {
        owner: String(AuthService.loggedUser._id)===String(tournament.owner._id),
        moderator: tournament.moderators.some(function(mod){
          return String(AuthService.loggedUser._id)===String(mod._id);
        }),
        player: tournament.players.some(function(player){
          return player ? String(AuthService.loggedUser._id)===String(player._id) : false;
        })
      } : {
        owner: false,
        moderator: false,
        player: false
      }
    }

    function isOwner(template){
      return AuthService.isLogged() && AuthService.loggedUser._id === template.owner._id
    }
  }

})();
