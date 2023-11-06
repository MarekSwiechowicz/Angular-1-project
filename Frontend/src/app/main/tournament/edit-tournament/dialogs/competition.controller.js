(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('CompetitionController', CompetitionController);

  function CompetitionController($mdDialog, exists, $location, block, tournament, compare, notifyOutputs, onSave) {

    var vm = this;
    //methods
    vm.closeDialog = closeDialog;
    vm.saveScores = saveScores;
    vm.getAllUsers = getAllUsers;
    vm.compare = compare;
    vm.notifyOutputs = notifyOutputs;
    vm.onSave = onSave;

    //variables
    var templateJson = tournament;
    var competitionBlock = block;
    vm.title = competitionBlock.name;
    vm.exists = exists;
    vm.players = getAllUsers(competitionBlock);

    //definitions


    function getAllUsers(block) {
      var players = [];

      for (var i = 0; i < block.inputs.length; i++) {
        players[i] = {
          Uid: competitionBlock.scores[i].Uid,
          name: templateJson.players[competitionBlock.scores[i].Uid].name,
          result: competitionBlock.scores[i].result
        };
      }
      return players;
    }

    function saveScores() {
      competitionBlock.scores = [];
      for (var i = 0; i < competitionBlock.inputs.length; i++) {
        var score = {
          Uid: vm.players[i].Uid,
          result: vm.players[i].result
        };
        competitionBlock.scores.push(score);
      }

      if (competitionBlock.logic.sort === 'asc') {
        competitionBlock.scores.sort(vm.compare.compareAsc);
      } else {
        competitionBlock.scores.sort(vm.compare.compareDesc);
      }


      var notify = true;
      competitionBlock.scores.map(function(score) {
          if (score.result === null || score.result === '') {
            notify = false;
          }
      });

      if (notify) {
        vm.notifyOutputs(competitionBlock);
      }

    //   vm.notifyOutputs(competitionBlock);

      getPlayersFromStandingsInputs();

      vm.closeDialog();
    }

    function getPlayersFromStandingsInputs() {

			// po wszystkich stendingsach w competition
      for (var sInput = 0; sInput < competitionBlock.standingsOutput.length; sInput++) {
        var standingsBlock = templateJson.blocks[competitionBlock.standingsOutput[sInput]]; // standings block do ktorego idzie competition
        for (var j = 0; j < competitionBlock.scores.length; j++) {

          var competitionID = competitionBlock.scores[j].Uid;
          if(standingsBlock.scores.length === 0) {
            standingsBlock.scores.push({
              'Uid': null,
              'result': null,
              'available': true
            });
          }

          for (var k = 0; k < standingsBlock.scores.length; k++) {

            if (standingsBlock.scores[k].Uid === competitionID) {
              standingsBlock.scores[k].result = 0;
              standingsBlock.scores[k].result += Number(competitionBlock.scores[j].result);

            } else {
              if (k === standingsBlock.scores.length - 1) {
                standingsBlock.scores.push({
                  'Uid': competitionBlock.scores[j].Uid,
                  'result': competitionBlock.scores[j].result,
                  'available': true
                });
              }
            }
          }
          // setSort(standingsBlock);
        }
        for (var n = 0; n < standingsBlock.standingsInputs.length; n++) {

          if (standingsBlock.standingsInputs[n] !== competitionBlock.id) {
            var cBlock = templateJson.blocks[standingsBlock.standingsInputs[n]];

            for (var m = 0; m < cBlock.scores.length; m++) {

              var Uid = cBlock.scores[m].Uid;

              for (var p = 0; p < standingsBlock.scores.length; p++) {
                if (standingsBlock.scores[p].Uid === Uid && includes(competitionBlock.scores, Uid)) {
                  standingsBlock.scores[p].result += Number(cBlock.scores[m].result);
                }
              }
            }
          }
        }
        setSort(standingsBlock);
        standingsBlock.scores = _.uniqBy(standingsBlock.scores, 'Uid');
        _.remove(standingsBlock.scores, function(obj){
          return obj.Uid === null;
        });
      }

    }

    function setSort(block) {
      if (block.logic.sort === 'asc') {
        block.scores.sort(vm.compare.compareAsc);
      } else {
        block.scores.sort(vm.compare.compareDesc);
      }
    }

		function includes(scores, id){
			for(var i = 0; i < scores.length; i++) {
				if(scores[i].Uid === id) {
					return true;
				}
			}
			return false;
		}

    function closeDialog() {
      vm.onSave();
      $mdDialog.hide();
    }
  }
})();
