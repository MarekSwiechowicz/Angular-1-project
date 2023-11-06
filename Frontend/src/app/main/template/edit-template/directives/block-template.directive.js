(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.template.edit')
    .directive('blockTemplate', blockTemplateDirective);

  /* @ngInject */
  function blockTemplateDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        blockFunctions: '=',
        blocks: '=',
        functions: '=',
        edit: '=',
        editBlock: '=',
        setPlayersInJson: '='
      },

      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;

        //Data
        vm.blockFromEditTemp = $scope.editBlock;

        vm.lastValue = null;
        if ($scope.editBlock.logic) {
          vm.lastValue = $scope.editBlock.logic.numberOfPlayer;
        }
        vm.block = $scope.ngModel;
        vm.lastValue = $scope.lastValue;
        vm.blocks = $scope.blocks;
        vm.edit = $scope.edit;
        vm.colors = utilsService.getBlockColors();
        vm.width = utilsService.getBlockWidth();
        vm.headerHeight = utilsService.getBlockHeaderHeight();

        //Methods
        vm.availableBlocks = $scope.blockFunctions.availableBlocks;
        vm.getAvailableCompetitions = $scope.blockFunctions.getAvailableCompetitions;
        vm.pair = $scope.blockFunctions.pair;
        vm.arrayWithBlocksAndPositions = $scope.blockFunctions.arrayWithBlocksAndPositions;
        vm.deleteFunction = $scope.blockFunctions.deleteFunction;
        vm.duplicateFunction = $scope.blockFunctions.duplicateFunction;
        vm.verifyAvailables = $scope.blockFunctions.verifyAvailables;
        vm.deleteConnections = $scope.blockFunctions.deleteConnections;
        // vm.openOptionsDialog = openOptionsDialog;
        vm.loadCompetitionList = $scope.blockFunctions.loadCompetitionList;
        vm.getNameById = $scope.blockFunctions.getNameById;
        vm.allCompetitions = $scope.blockFunctions.allCompetitions;
        vm.setPlayersInJson = $scope.setPlayersInJson;



        function getBlocks(currentBlockId) { // na razie nie używane
          var blocks = [];
          for (var key in vm.templateJson.blocks) {
            if (currentBlockId !== key &&
              vm.templateJson.blocks[key].type !== 'standings' &&
              checkIfBlockAvailable(key)) {
              blocks.push(key);
            }
          }
          return blocks;
        }

        function checkIfBlockAvailable(blockId) { // na razie nie używane
          var available = false;
          for (var key in vm.templateJson.blocks) {
            if (vm.templateJson.blocks[key].available) {
              available = true;
              break;
            }
          }
          return available;
        }

        // function openOptionsDialog() {
        //   $scope.editBlock = vm.block;
        // }
        // if (vm.block.type !== 'standings') {
        //   $scope.$watch('vm.block.scores.length', function() {
        //     vm.block.size.height = vm.block.scores.length + 3;
        //   });
        // }

      }]
    };
  }
})();
