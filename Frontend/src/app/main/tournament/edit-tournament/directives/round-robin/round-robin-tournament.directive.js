(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('roundRobinTournament', roundRobinTournamentDirective);

  /** @ngInject */
  function roundRobinTournamentDirective($mdDialog, utilsService) {
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

        vm.finished=function(){
          utilsService.getPositions($scope.ngModel);
        }
        vm.labelsHeight=utilsService.getBlockLabelsHeight();
        //Data
        vm.block = $scope.ngModel;
        vm.players = $scope.players;
        //Methods


      }]
    };
  }
})();
