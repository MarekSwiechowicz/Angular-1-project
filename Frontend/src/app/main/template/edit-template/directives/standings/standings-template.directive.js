(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.template.edit')
    .directive('standingsTemplate', standingsTemplateDirective);

  /** @ngInject */
  function standingsTemplateDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        deleteFunction: '=',
        getAvailableCompetitions: '=',
        getAvailablePositions: '=',
        setAvailables: '=',
        verifyAvailables: '=',
        verifyAvailablesInPos: '=',
        loadCompetitionList: '=',
        getNameById: '=',
        allCompetitions: '=',
        edit: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();
        vm.labelsHeight = utilsService.getBlockLabelsHeight();
        vm.width = utilsService.getBlockWidth();
        vm.header = utilsService.getBlockHeaderHeight();
        //Data
        vm.block = $scope.ngModel;
        vm.allCompetitions = [];
        vm.standingsInputsIds = [];
        vm.checks = [];
        vm.edit = $scope.edit;

        //Methods
        vm.getAvailableC = $scope.getAvailableCompetitions;
        vm.getAvailableP = $scope.getAvailablePositions;
        vm.setAvailables = $scope.setAvailables;
        vm.verifyAvailables = $scope.verifyAvailables;
        vm.verifyAvailablesInPos = $scope.verifyAvailablesInPos;
        vm.getAvailableP = $scope.getAvailablePositions;
        vm.deleteFunction = $scope.deleteFunction;
        vm.loadCompetitionList = $scope.loadCompetitionList;
        vm.getNameById = $scope.getNameById;
        // vm.allCompetitions = vm.getAvailableC(vm.block.id);
        // vm.allCompetitions = {tab: []}
        vm.allCompetitions = $scope.allCompetitions;

        vm.getChecked = function(id) {
          return vm.block.standingsInputs.indexOf(Number(id)) !== -1;
        };

        vm.onClick = function(id) {
          if (vm.edit) {
            if (vm.block.standingsInputs.indexOf(Number(id)) !== -1) {
              vm.block.standingsInputs.splice(vm.block.standingsInputs.indexOf(Number(id)), 1);
            } else {
              vm.block.standingsInputs.push(Number(id));
              vm.block.standingsInputs.sort();
            }
          }
        };
        vm.loadCompetitionList(vm.block, vm.allCompetitions);
        // console.log(vm.allCompetitions);
        vm.myFunction = function() {
          // console.log(vm.selectedVegetables);
          vm.standingsInputsIds = [];
          // console.log('checks:', vm.checks);
          for (var i = 0; i < vm.checks.length; i++) {
            if (vm.checks[i].checked) {
              vm.standingsInputsIds.push(vm.allCompetitions[i]);
            }
          }
          // console.log('index:',index );
          // vm.standingsInputsIds.push(index);
          // console.log('standingsInputsIds', vm.standingsInputsIds);
          vm.block.standingsInputs = vm.standingsInputsIds;
        };


        vm.removeBlock = function() {
          vm.deleteFunction(vm.block.id);
        };

        vm.closek = function() {
          return null;
        };

      }]
    };
  }
})();
