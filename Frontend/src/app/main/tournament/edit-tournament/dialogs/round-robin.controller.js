(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('RoundRobinController', RoundRobinController);

  function RoundRobinController($mdDialog, exists, $location, block, tournament, compare, notifyOutputs, falsePrevious, viewOnly, onSave) {
    var vm = this;
    //methods
    vm.closeDialog = closeDialog;
    vm.saveScores = saveScores;
    vm.compare = compare;
    vm.notifyOutputs = notifyOutputs;
    vm.falsePrevious = falsePrevious;
    vm.changeContent = changeContent;
    vm.getTableValues = getTableValues;
    vm.getLabelName = getLabelName;
    vm.onSave = onSave;

    vm.tournamentJson = tournament;
    vm.RRJson = block;

    //variables
    vm.title = vm.tournamentJson.name;
    vm.exists = exists;
    vm.flagContentInput = true;
    vm.tableValues = [];
    vm.labelName = getLabelName();
    vm.tableLabels = ['Lp.', 'Name', 'Points', 'Wins', 'Draws', 'Loss', 'All matches'];
    vm.viewOnly = viewOnly;

    //definitions
    function getLabelName() {
      var label = '';
      if (vm.RRJson.logic.modWritesPkt) {
        label = 'Score';
      } else {
        label = 'Points';
      }
      return label;
    }

    function getTableValues() {
      var players = [];
      var name = null;
      var score = null;
      var wins = null;
      var draws = null;
      var loss = null;
      var allMatches = null;

      for (var i = 0; i < block.scores.length; i++) {
        if (block.scores[i].result) {
          name = vm.tournamentJson.players[block.scores[i].Uid].name;
          score = block.scores[i].result;
        } else {
          name = vm.tournamentJson.players[block.scores[i].Uid].name;
          score = '0';
        }
        if (block.scores[i].w) {
          wins = block.scores[i].w;
        } else {
          wins = '0';
        }
        if (block.scores[i].d) {
          draws = block.scores[i].d;
        } else {
          draws = '0';
        }
        if (block.scores[i].l) {
          loss = block.scores[i].l;
        } else {
          loss = '0';
        }
        if (block.scores[i].allMatches) {
          allMatches = block.scores[i].allMatches;
        } else {
          allMatches = '0';
        }

        players.push({
          name: name,
          score: score,
          wins: wins,
          draws: draws,
          loss: loss,
          allMatches: allMatches
        });
      }

      return players;
    }

    function changeContent() {
      vm.flagContentInput = !vm.flagContentInput;
      saveMatchesToTable();
      vm.tableValues = getTableValues();
    }


    function writePts(result1, result2, score, logic) {
      score.allMatches++;
      if (result1 > result2) {
        score.result = score.result + logic.wPkt;
        score.w++;
      } else if (result1 < result2) {
        score.result = score.result + logic.lPkt;
        score.l++;
      } else {
        score.result = score.result + logic.dPkt;
        score.d++;
      }
    }

    function writeResults(result1, result2, score) {
      score.allMatches++;
      score.result = score.result + result1;
      if (result1 > result2) {
        score.w++;
      } else if (result1 < result2) {
        score.l++;
      } else {
        score.d++;
      }
    }

    function saveMatchesToTable() {
      vm.RRJson.scores.map(function(score) {
        score.result = 0;
        score.w = 0;
        score.d = 0;
        score.l = 0;
        score.allMatches = 0;
      });

      vm.RRJson.matches.map(function(queue) {
        queue.map(function(match) {
          if (match.scores[0].result !== null && match.scores[1].result !== null && match.scores[0].result !== '' && match.scores[1].result !== '') {

            var result1 = Number(match.scores[0].result);
            var result2 = Number(match.scores[1].result);

            vm.RRJson.scores.map(function(score) {
              if (vm.RRJson.logic.sort === 'desc') {
                if (vm.RRJson.logic.modWritesPkt === 'false') {
                  if (score.Uid === match.scores[0].Uid) {
                    writePts(result1, result2, score, vm.RRJson.logic);
                  } else if (score.Uid === match.scores[1].Uid) {
                    writePts(result2, result1, score, vm.RRJson.logic);
                  }
                } else {
                  if (score.Uid === match.scores[0].Uid) {
                    writeResults(result1, result2, score);
                  } else if (score.Uid === match.scores[1].Uid) {
                    writeResults(result2, result1, score);
                  }
                }
              } else {
                if (vm.RRJson.logic.modWritesPkt === 'false') {
                  if (score.Uid === match.scores[0].Uid) {
                    writePts(result2, result1, score, vm.RRJson.logic);
                  } else if (score.Uid === match.scores[1].Uid) {
                    writePts(result1, result2, score, vm.RRJson.logic);
                  }
                } else {
                  if (score.Uid === match.scores[0].Uid) {
                    writeResults(result2, result1, score);
                  } else if (score.Uid === match.scores[1].Uid) {
                    writeResults(result1, result2, score);
                  }
                }
              }
            });
          }
        });
      });

      if (vm.RRJson.logic.sort === 'asc') {
        vm.RRJson.scores.sort(vm.compare.compareAsc);
      } else {
        vm.RRJson.scores.sort(vm.compare.compareDesc);
      }
    }

    function saveScores() {
      saveMatchesToTable();
      vm.falsePrevious(vm.RRJson);

      var notify = true;
      vm.RRJson.matches.map(function(queue) {
        queue.map(function(match) {
          if (match.scores[0].result === null || match.scores[1].result === null || match.scores[0].result === '' || match.scores[1].result === '') {
            notify = false;
          }
        });
      });

      if (notify) {
        vm.notifyOutputs(vm.RRJson);
      }
      vm.onSave();
      vm.closeDialog();
    }

    function closeDialog() {
      $mdDialog.hide();
    }
  }
})();
