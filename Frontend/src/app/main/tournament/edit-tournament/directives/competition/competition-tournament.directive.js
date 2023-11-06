(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('competitionTournament', competitionTournamentDirective);

  /** @ngInject */
  function competitionTournamentDirective($mdDialog, utilsService) {
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

        vm.finished=function(){
          utilsService.getPositions($scope.ngModel);
        }
        vm.labelsHeight=utilsService.getBlockLabelsHeight();

        //Methods;

        function getPlayersForThisBlock() {
          var tempPlayers = [];
          for (var i = 0; i < vm.block.inputs.length; i++) {
            tempPlayers.push($scope.players[vm.block.scores[i].Uid]);
          }
          return tempPlayers;
        }

      }]
    };
  }
})();
