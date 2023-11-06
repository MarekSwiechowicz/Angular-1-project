(function() {
  'use strict';

  angular
    .module('app.tournament')
    .service('editTournamentService', editTournamentService);

  /** @ngInject */
  function editTournamentService(msApi, $mdDialog) {
    var service = this;

    var tournament;
    var compare = {
      compareAsc: compareAsc,
      compareDesc: compareDesc
    };

    return {
      showStartListDialog: showStartListDialog,
      showRandomizeListDialog: showRandomizeListDialog,
      showStandingsDialog: showStandingsDialog,
      showRoundRobinScoresDialog: showRoundRobinScoresDialog,
      showCompetitionScoresDialog: showCompetitionScoresDialog,
      showOneVsOneScoresDialog: showOneVsOneScoresDialog,
      newTournamentDialog: newTournamentDialog
    };




    function showStartListDialog(locals) {
      tournament = locals.tournament;
      locals.notifyOutputs = notifyOutputs;
      $mdDialog.show({
        controller: 'StartListController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/start-list.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function showRandomizeListDialog(locals) {
      tournament = locals.tournament;
      $mdDialog.show({
        controller: 'RandomizeController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/randomize.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function showStandingsDialog(locals) {
      tournament = locals.tournament;
      $mdDialog.show({
        controller: 'StandingsController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/standings.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function showRoundRobinScoresDialog(locals, vmEdit) {
      tournament = locals.tournament;
      locals.notifyOutputs = notifyOutputs;
      locals.falsePrevious = falsePrevious;
      locals.viewOnly = !vmEdit;
      locals.compare = compare;
      $mdDialog.show({
        controller: 'RoundRobinController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/round-robin.html',
        clickOutsideToClose: !vmEdit,
        locals: locals
      });
    }

    function showCompetitionScoresDialog(locals) {
      tournament = locals.tournament;
      locals.notifyOutputs = notifyOutputs;
      locals.compare = compare;
      $mdDialog.show({
        controller: 'CompetitionController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/competition.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function showOneVsOneScoresDialog(locals) {
      tournament = locals.tournament;
      locals.notifyOutputs = notifyOutputs;
      locals.compare = compare;
      $mdDialog.show({
        controller: 'VersusController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/versus.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function newTournamentDialog(locals) {
      tournament = locals.tournament;
      locals.compare = compare;
      $mdDialog.show({
        controller: 'AdminPanelController',
        controllerAs: 'vm',
        templateUrl: 'app/main/tournament/edit-tournament/dialogs/admin-panel.html',
        clickOutsideToClose: false,
        locals: locals
      });
    }

    function compareAsc(a, b) {
      a = Number(a.result);
      b = Number(b.result);

      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    }

    function compareDesc(a, b) {
      a = Number(a.result);
      b = Number(b.result);
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      }
      return 0;
    }

    // AKTYWUJE wszystkie bloczki, ktore sa nstepne, czyli sa w tabeli output
    function notifyOutputs(block) {

      if (block.type === 'randListBlock') {
        for (var i = 0; i < block.scores.length; i++) {
          block.scores[i].Uid = block.inputs[i].Uid;
        }
        block.scores = shuffle(block.scores);
      }

      block.output.map(function(oneOutputId) { // dla kazdego bloczku z outputu
        var oneOutput = tournament.blocks[oneOutputId]; // bloczek, do ktorego wychodzimy z obecnego, czyli z block
        for (var inputId in oneOutput.inputs) {
          var inputObj = oneOutput.inputs[inputId];
          if (inputObj.idBlock == block.id) {
            inputObj.Uid = block.scores[inputObj.posInBlock - 1].Uid;
            oneOutput.scores[inputId].Uid = block.scores[inputObj.posInBlock - 1].Uid;
            if (oneOutput.type === 'RR') { // wpisanie Uids do meczy
              oneOutput.matches.map(function(queue) {
                queue.map(function(match) {
                  match.inputs.map(function(input) {
                    if (getNumber(input.localId) == Number(inputId) + 1) {
                      input.Uid = inputObj.Uid;
                      match.scores[match.inputs.indexOf(input)].Uid = inputObj.Uid;
                    }
                  });
                });
              });
            }
          }

        }

        oneOutput.active = true;
        for (var inputId in oneOutput.inputs) {
          var inputObj = oneOutput.inputs[inputId];
          if (inputObj.Uid === null) {
            oneOutput.active = false;
          }
        }

        if (oneOutput.type === 'randListBlock' && oneOutput.active) {
          notifyOutputs(oneOutput);
        }

      });

      if (block.type !== 'startList' && block.type !== 'randListBlock') {
        falsePrevious(block);
      }
    }

    function getNumber(string) {
      string = String(string);
      return Number(string.substring(0, string.length - 1));
    }

    function shuffle(sourceArray) {

      for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
      }
      return sourceArray;
    }

    function falsePrevious(block) {
      block.inputs.map(function(oneInputId) { // dla kazdego bloczku z inputu (czyli bloczka 'wczesniejszego')
        var id = oneInputId.idBlock;
        var oneInput = tournament.blocks[id]; // bloczek, poprzedni
        oneInput.active = false;
        if (oneInput.type === 'randListBlock') {
          oneInput.inputs.map(function(oneInputId1) { // dla kazdego bloczku z inputu (czyli bloczka 'wczesniejszego')
            var id1 = oneInputId1.idBlock;
            var oneInput1 = tournament.blocks[id1]; // bloczek, poprzedni
            oneInput1.active = false;
          });
        }
      });
    }


  }
})();
