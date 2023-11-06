(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.template.edit')
    .directive('selectLine', selectLineDirective);

  /** @ngInject */
  function selectLineDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        number: '=',
        functions: '=',
        block: '=',
        arrayWithBlocksAndPositions: '=',
        availableBlocks: '=',
        available: '=',
        pair: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        //Data
        vm.block = $scope.block;
        vm.number = $scope.number + 1;
        vm.positionName = null;
        setPositionName();
        vm.colors = utilsService.getBlockColors();

        // tables
        // vm.availableBlocks = $scope.availableBlocks;
        // vm.arrayWithBlocksAndPositions = $scope.arrayWithBlocksAndPositions;
        vm.pair = $scope.pair;
        // console.log();

        // methods
        vm.setAvailable = $scope.functions.setAvailable;
        vm.getAvailablePositions = getAvailablePositions;
        vm.clearLine = clearLine;
        vm.setInput = setInput;
        vm.setOutput = setOutput;
        vm.labelsHeight = utilsService.getBlockLabelsHeight();


        function setInput() {
          if (vm.block.outputs[vm.number-1].available) {   // zaznaczylismy check
            vm.pair.input.idBlock = vm.block.id;
            vm.pair.input.posInBlock = vm.number;
        }  else  if(vm.block.outputs[vm.number-1].idBlock){      //  odznaczamy gdy jest sparowane
            vm.block.outputs[vm.number-1].idBlock = null;
            vm.block.outputs[vm.number-1].posInBlock = null;
            vm.pair.input.idBlock = -(vm.block.id);
            vm.pair.input.posInBlock = -(vm.number);
        } else {       // odznaczamy ale nie bylo sparowane
            vm.pair.input.idBlock = null;
            vm.pair.input.posInBlock = null;
          }
        }

        function setOutput() {
          if (vm.block.inputs[vm.number-1].available) {
            vm.pair.output.idBlock = vm.block.id;
            vm.pair.output.posInBlock = vm.number;
        } else  if(vm.block.inputs[vm.number-1].idBlock){      //  odznaczamy gdy jest sparowane
            vm.block.inputs[vm.number-1].idBlock = null;
            vm.block.inputs[vm.number-1].posInBlock = null;
            vm.pair.output.idBlock = -(vm.block.id);
            vm.pair.output.posInBlock = -(vm.number);
        } else {
            vm.pair.output.idBlock = null;
            vm.pair.output.posInBlock = null;
          }
        }

        function getAvailablePositions(idBlock, idk) {
          vm.positionsArray = $scope.functions.getAvailableP(idBlock, idk);
        }

        function clearLine(number) {
          vm.block.inputs[vm.number - 1].posInBlock = null;
          vm.setAvailable(vm.number);
        }

        function setPositionName() {
          if (vm.number%10 === 1 && vm.number%100 !== 11) {
            vm.positionName = vm.number + 'st';
          } else if (vm.number%10 === 2 && vm.number%100 !== 12) {
            vm.positionName = vm.number + 'nd';
          } else if (vm.number%10 === 3 && vm.number%100 !== 13) {
            vm.positionName = vm.number + 'rd';
          } else {
            vm.positionName = vm.number + 'th';
          }
        }

      }]
    };
  }
})();
