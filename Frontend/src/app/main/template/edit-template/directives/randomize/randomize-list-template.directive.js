(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.template.edit')
    .directive('randomizeListTemplate', randomizeListTemplateDirective);

  /** @ngInject */
  function randomizeListTemplateDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        deleteFunction: '=',
        duplicateFunction: '=',
        verifyAvailables: '=',
        arrayWithBlocksAndPositions: '=',
        availableBlocks: '=',
        edit: '=',
        pair: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;

        vm.colors=utilsService.getBlockColors();
        vm.labelsHeight = utilsService.getBlockLabelsHeight();
        vm.width = utilsService.getBlockWidth();
        vm.header = utilsService.getBlockHeaderHeight();
        //Data
        vm.block = $scope.ngModel;
        vm.arrayWithBlocksAndPositions = $scope.arrayWithBlocksAndPositions;
        vm.availableBlocks = $scope.availableBlocks;
        vm.pair = $scope.pair;
        //Methods
        vm.deleteFunction = $scope.deleteFunction;
        vm.duplicateFunction = $scope.duplicateFunction;
        vm.verifyAvailables = $scope.verifyAvailables;
        vm.functions = {
          setAvailable: vm.verifyAvailables
        };
        vm.playerName = playerName;

        function playerName(id) {
          return (vm.block.logic.rand) ? 'Random player' : 'Player '+(id+1);
        }

        vm.setAvailable = function(line) {
          if (vm.block.inputs[line].idBlock) {
            vm.verifyAvailables();
          }
        };

        vm.removeBlock = function() {
            vm.deleteFunction(vm.block.id);
        };

        function setPlayersInJson() {
            vm.block.scores = [];
            var iter = vm.block.logic.numberOfPlayers;
            while(iter--){
                var score = {
                    Uid: null,
                    available: true
                };
                vm.block.scores.push(score);
            }
        }

      }]
    };
  }
})();
