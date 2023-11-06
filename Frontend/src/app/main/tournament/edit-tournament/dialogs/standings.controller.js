(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('StandingsController', StandingsController);

  function StandingsController($mdDialog, exists, $location, tournament, onSave) {
    //variables
    var vm = this;
    vm.exists = exists;
    vm.title = 'Standings';
    //methods
    vm.closeDialog = closeDialog;
    vm.onSave = onSave;

    //definitions
    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();
