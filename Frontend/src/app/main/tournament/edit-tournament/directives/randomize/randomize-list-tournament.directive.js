(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('randomizeListTournament', randomizeListTournamentDirective);

  /** @ngInject */
  function randomizeListTournamentDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        players: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();

        //Data
        vm.block = $scope.ngModel;
        vm.players = getPlayersForThisBlock();
        //Methods

        // vm.playerName = playerName;
        vm.finished=function(){
          utilsService.getPositions($scope.ngModel);
        }

        function getPlayersForThisBlock() {
          var tempPlayers = [];
          for (var i = 0; i < vm.block.inputs.length; i++) {
            tempPlayers.push($scope.players[vm.block.scores[i].Uid]);
          }
          return tempPlayers;
        }

        vm.labelsHeight=utilsService.getBlockLabelsHeight();

        // function playerName(id) {
        //   return (vm.block.logic.rand) ? 'Random player' : 'Player '+(id+1);
        // }

      }]
    };
  }
})();
