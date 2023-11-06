(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('standingsTournament', standingsTournamentDirective);

  /** @ngInject */
  function standingsTournamentDirective($mdDialog,utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        players: '=',
        tournament: '=',
        compare: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', '$interval', function($scope, $interval) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();

        //Data
        vm.block = $scope.ngModel;
        vm.players = $scope.players;
        vm.tournament = $scope.tournament;
        vm.compare = $scope.compare;
        vm.labelsHeight=utilsService.getBlockLabelsHeight();

        vm.standingsInputs = vm.block.standingsInputs;

        // getPlayersFromStandingsInputs();
        //
        // //Methods
        // function getPlayersFromStandingsInputs() {
        //
        //   setSort(vm.block);
        //
        //   vm.block.scores = _.remove(vm.block.scores, function(obj){
        //     return obj.Uid !== null;
        //   });
        //
        // }

        function setSort(block) {
          if (block.logic.sort === 'asc') {
            block.scores.sort(vm.compare.compareAsc);
          } else {
            block.scores.sort(vm.compare.compareDesc);
          }
        }

        function isInStandingsIDs(ids, id) {
          for (var i = 0; i < ids.length; i++) {
            if (ids[i] === id) {
              return true;
            }
          }
          return false;
        }

      }]
    };
  }
})();
