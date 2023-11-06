(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('VersusController', VersusController);

  function VersusController($mdDialog,  $location, block, tournament, compare, notifyOutputs, onSave) {
    var vm = this;
    //methods
    vm.closeDialog = closeDialog;
    vm.saveScores = saveScores;
    vm.notifyOutputs = notifyOutputs;
    vm.compare = compare;
    vm.onSave = onSave;

    //variables
    var templateJson = tournament;
    vm.vsBlock = block;

    vm.title = vm.vsBlock.name;
    vm.score1 = vm.vsBlock.scores[0].result;
    vm.score2 = vm.vsBlock.scores[1].result;
    vm.player1 = templateJson.players[vm.vsBlock.scores[0].Uid];
    vm.player2 = templateJson.players[vm.vsBlock.scores[1].Uid];


    //definitions
    function saveScores() {
      vm.vsBlock.scores[0].result = vm.score1;
      vm.vsBlock.scores[1].result = vm.score2;

      if(vm.vsBlock.logic.sort==='asc'){
          vm.vsBlock.scores.sort(vm.compare.compareAsc);
      } else {
          vm.vsBlock.scores.sort(vm.compare.compareDesc);

      }

      vm.notifyOutputs(vm.vsBlock);
      vm.onSave();
      vm.closeDialog();
    }

    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();
