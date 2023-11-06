(function() {
  'use strict';
  angular
    .module('app.template.edit')
    .controller('BlockOptionsDialogController', BlockOptionsDialogController);
  /** @ngInject */
  function BlockOptionsDialogController($mdDialog, block, lastValue, closeDialogAction, edit) {
    var vm = this;

    // Data
    vm.block = block;
    vm.edit = edit;
    vm.lastValue = vm.block.logic.numberOfPlayers;
    // Methods
    vm.close = close;
    vm.changeNumberOfPlayers = changeNumberOfPlayers;

    // console.log('DIALOG OPCsJI');

    function changeNumberOfPlayers() {
    }

    function close() {
        if(vm.lastValue !== vm.block.logic.numberOfPlayers){
            closeDialogAction();
        }
      $mdDialog.hide();
    }
  }
})();
