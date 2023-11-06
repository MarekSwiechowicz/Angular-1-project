(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('blockTournament', blockTournamentDirective)
    .directive('ngX1', function() {
      return function(scope, element, attrs) {
        scope.$watch(attrs.ngX1, function(value) {
          element.attr('x1', value);
        });
      };
    }).directive('ngX2', function() {
      return function(scope, element, attrs) {
        scope.$watch(attrs.ngX2, function(value) {
          element.attr('x2', value);
        });
      };
    }).directive('ngY1', function() {
      return function(scope, element, attrs) {
        scope.$watch(attrs.ngY1, function(value) {
          element.attr('y1', value);
        });
      };
    }).directive('ngY2', function() {
      return function(scope, element, attrs) {
        scope.$watch(attrs.ngY2, function(value) {
          element.attr('y2', value);
        });
      };
    });

  /* @ngInject */
  function blockTournamentDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        compare: '=',
        tournament: '=',
        players: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();
        //Data
        vm.block = $scope.ngModel;
        if(vm.block.type === 'randListBlock'){
            vm.block.name = 'Draw'
        }
        vm.tournament = $scope.tournament;
        vm.players = $scope.players;
        vm.compare = $scope.compare;
        vm.headerHeight = utilsService.getBlockHeaderHeight();

      }]
    };
  }
})();
