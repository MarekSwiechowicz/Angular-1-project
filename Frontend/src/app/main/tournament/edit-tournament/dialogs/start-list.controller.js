(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('StartListController', StartListController);

  function StartListController($mdDialog, exists, $location, block, tournament, notifyOutputs, userService, onSave) {
    var vm = this;
    //methods
    vm.closeDialog = closeDialog;
    vm.save = save;
    vm.tournament = tournament;
    vm.notifyOutputs = notifyOutputs;
    vm.inputChange = inputChange;
    vm.findUsers = findUsers;
    vm.clear_id = clear_id;
    vm.onSave = onSave;

    //variables
    var tournamentJson = tournament;
    var startListBlock = block;
    vm.title = startListBlock.name;
    vm.startListPlayers = tournament.players;
    vm.userPhrase = '';
    vm.userList = [];

    function clear_id(index) {
      if (!vm.startListPlayers[index].real) {
        tournamentJson.players[index]._id = null;
      }
    }

    function findUsers(word, pageNumber, pageSize) {
      var from = (pageNumber - 1) * pageSize;
      return userService.findUsers(from, pageSize, word).then(function(response) {
        return {
          data: response.data.users,
          size: response.data.amount
        };
      });
    }

    function inputChange(event) {
      event.stopPropagation();
    }

    function save() {
      for (var i = 0; i < tournamentJson.players.length; i++) {

        block.scores[i].Uid = i;
      }
      var notify = true;
      tournamentJson.players.map(function(player) {

        if (player.name === null || player.name === '') {
          notify = false;
        }
      });
      if (notify) {
        vm.notifyOutputs(block);
      }

      vm.onSave();
      vm.closeDialog();
    }

    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();
