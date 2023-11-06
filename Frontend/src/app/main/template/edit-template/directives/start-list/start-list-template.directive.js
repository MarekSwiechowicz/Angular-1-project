(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.template.edit')
    .directive('startListTemplate', startListTemplateDirective);

  /** @ngInject */
  function startListTemplateDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        deleteFunction: '=',
        verifyAvailables: '=',
        edit: '=',
        pair: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.colors = utilsService.getBlockColors();
        vm.labelsHeight = utilsService.getBlockLabelsHeight();
        vm.width = utilsService.getBlockWidth();
        vm.headerHeight = utilsService.getBlockHeaderHeight();
        //Data
        vm.block = $scope.ngModel;
        vm.pair = $scope.pair;

        //Methods
        // vm.openOptionsDialog = openOptionsDialog;
        vm.deleteFunction = $scope.deleteFunction;
        vm.playerName = playerName;
        vm.functions = {
          setAvailable: vm.verifyAvailables
        };


        vm.colors = utilsService.getBlockColors();
        vm.labelsHeight = utilsService.getBlockLabelsHeight();
        vm.width = utilsService.getBlockWidth();
        vm.header = utilsService.getBlockHeaderHeight();


        vm.setAvailable = function(line) {
          if (vm.block.inputs[line].idBlock) {
            vm.verifyAvailables();
          }
        };


        function playerName(id) {
          return (vm.block.logic.rand) ? 'Random player' : 'Player ';
        }

        // function openOptionsDialog() {
        //   $mdDialog.show({
        //     controller: 'BlockOptionsDialogController',
        //     controllerAs: 'vm',
        //     templateUrl: currentScriptPath.replace('start-list-template.directive.js', '../../dialogs/block-options-dialog.html'),
        //     clickOutsideToClose: true,
        //     locals: {
        //       block: vm.block,
        //       closeDialogAction: setPlayersInJson
        //     },
        //   });
        // }

        vm.removeBlock = function() {
            vm.deleteFunction(vm.block.id);
        };

      }]
    };
  }
})();
