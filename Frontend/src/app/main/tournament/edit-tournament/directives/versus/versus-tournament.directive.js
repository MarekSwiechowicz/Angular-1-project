(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('versusTournament', versusTournamentDirective);

  /** @ngInject */
  function versusTournamentDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        players: '='
      },
      controllerAs: 'vm',
      controller: ['$scope','$element','$timeout','$q', function($scope, $element, $timeout,$q) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();

        vm.finished=function(){
          utilsService.getPositions($scope.ngModel);
        }
        //Data
        vm.block = $scope.ngModel;
        vm.players = getPlayersForThisBlock();
        vm.labelsHeight=utilsService.getBlockLabelsHeight();
        //Methods
        function getPlayersForThisBlock() {
          return [
            $scope.players[vm.block.inputs[0].Uid],
            $scope.players[vm.block.inputs[1].Uid]
          ];
        }

      }]
    };
  }
})();
