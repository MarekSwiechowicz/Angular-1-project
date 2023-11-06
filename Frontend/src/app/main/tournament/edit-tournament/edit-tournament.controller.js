(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('TournamentEditController', TournamentEditController);
  /** @ngInject */
  function TournamentEditController($scope, $timeout, $state, $mdDialog, $location, tournamentService, utilsService, userService, editTournamentService) {
    var vm = this;
    vm.colors = utilsService.getBlockColors();
    vm.tournamentID = $state.params.tournamentID;
    vm.roles = {
      owner: false,
      moderator: false,
      player: false
    };
    vm.edit = false;
    vm.done = false;
    utilsService.clearPositions();
    vm.positions = utilsService.positions;
    //INIT
    tournamentService.getTournament(vm.tournamentID).then(function(response) {
      if (response.success) {
        universalResizeGrid(response.data.blocks);
        vm.tournamentJson = response.data;
        vm.roles = userService.getRoles(vm.tournamentJson);
        vm.edit = vm.roles.owner || vm.roles.moderator;
        if (!(vm.edit || vm.roles.player) && vm.tournamentJson.private) {
          $location.path('/list-tournament');
          vm.showToast('You are not permitted to see this tournament');
        }
        getConnections();
        $scope.$watch('vm.positions.obj', function() {
          vm.gotPositions = Object.keys(vm.positions.obj).length === Object.keys(vm.tournamentJson.blocks).filter(function(key) {
            return vm.tournamentJson.blocks[key].type !== 'standings';
          }).length;
        }, true);
        vm.done = true;
      } else {
        vm.showToast(response.message);
      }
      resizeGrid();
    }).catch(function(err) {
      vm.showToast(err);
      resizeGrid();
    });

    //Data
    vm.gridsterOptions = {
      margins: [10, 10],
      columns: 5,
      floating: false,
      colWidth: 250,
      rowHeight: 21,
      maxSizeX: 1,
      pushing: false,
      draggable: {
        enabled: false
      },
      resizable: {
        handles: []
      }
    };

    vm.customMap = {
      row: 'block.location.y',
      col: 'block.location.x',
      sizeY: 'block.size.height',
      sizeX: 'block.size.width',
      maxSizeY: 'block.size.maxHeight'
    };

    //Methods
    vm.getWidth = getWidth;
    vm.newTournamentDialog = newTournamentDialog;
    vm.saveTournament = saveTournament;

    vm.showOneVsOneScoresDialog = showOneVsOneScoresDialog;
    vm.showCompetitionScoresDialog = showCompetitionScoresDialog;
    vm.showRoundRobinScoresDialog = showRoundRobinScoresDialog;
    vm.showStandingsDialog = showStandingsDialog;
    vm.showRandomizeListDialog = showRandomizeListDialog;
    vm.showStartListDialog = showStartListDialog;
    vm.showToast = utilsService.showToast;
    vm.checkIfBlockActive = checkIfBlockActive;
    vm.refreshTournament = refreshTournament;

    vm.dialogs = {
      startList: vm.showStartListDialog,
      randListBlock: null,
      standings: vm.showStandingsDialog,
      RR: vm.showRoundRobinScoresDialog,
      competition: vm.showCompetitionScoresDialog,
      versus: vm.showOneVsOneScoresDialog
    };


    $('#show-sidenav-tournament').on('click', function() {
        (function toggleIcon(){
          $('#show-sidenav-tournament >').toggleClass('icon-cog');
          $('#show-sidenav-tournament >').toggleClass('icon-arrow-right');
        })();

        var sidenav = $('#options-sidenav-tournament');

        sidenav.toggle('slide',{direction:'right'},500);
    });


    //definiotons
    function showStartListDialog(block, tournament) {
      editTournamentService.showStartListDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        });
    }

    function showRandomizeListDialog(block, tournament) {
      editTournamentService.showRandomizeListDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        });
    }

    function showStandingsDialog(block, tournament) {
      editTournamentService.showStandingsDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        });
    }

    function showRoundRobinScoresDialog(block, tournament) {
      editTournamentService.showRoundRobinScoresDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        },
        vm.edit);
    }

    function showCompetitionScoresDialog(block, tournament) {
      editTournamentService.showCompetitionScoresDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        });
    }

    function showOneVsOneScoresDialog(block, tournament) {
      editTournamentService.showOneVsOneScoresDialog(
        {
          exists: true,
          block: block,
          tournament: tournament,
          onSave: dialogSave
        });
    }

    function newTournamentDialog() {
      editTournamentService.newTournamentDialog(
        {
          tournament: vm.tournamentJson,
          template: null
        });
    }

    function saveTournament() {
      tournamentService.updateTournament(vm.tournamentID, vm.tournamentJson).then(function(response) {
        if (response.success) {
          vm.showToast('Your tournament has been saved.');
        } else {
          vm.showToast(response.message);
        }
      });
    }

    function dialogSave() {
      saveTournament();
    }


    // TODO PRZY ZAMYKANIU DIALOGU TRZEBA UZULEPNIAC INPUTS[] NULLAMI
    vm.addInputs = function(block, line, idBlock, posInBlock) {
      // dodanie inputow
      var indexInBlocks = block.id;
      var input = {
        idBlock: idBlock,
        posInBlock: posInBlock,
        Uid: null
      };
      vm.tournamentJson.blocks[indexInBlocks].inputs[line - 1] = input;

      // + dodanie outputu w odpowiednim bloczku
      vm.tournamentJson.blocks[idBlock].output.push(indexInBlocks);
    };



    function getWidth() { //funkcja zwracajaca rozmiar do diva, ktory rozszerza pole w prawo
      var width = vm.gridsterOptions.columns * (vm.gridsterOptions.colWidth + vm.gridsterOptions.margins[0]) + vm.gridsterOptions.margins[0];
      vm.width = width;
      return 'width: ' + width + 'px;';
    }

    function getWidth2() { //funkcja zwracajaca rozmiar do diva, ktory rozszerza pole w prawo
      return String(vm.gridsterOptions.columns * (vm.gridsterOptions.colWidth + vm.gridsterOptions.margins[0]) + vm.gridsterOptions.margins[0]);
    }



    function resizeGrid() {
      $scope.$watch('vm.tournamentJson.blocks', function(blocks) {
        if (vm.gridsterOptions.columns < 6) {
          vm.gridsterOptions.columns = 6;
          return;
        } //funkcja rozszerzajaca pole w prawo
        var max = 0;
        for (var id in vm.tournamentJson.blocks) {
          if (vm.tournamentJson.blocks.hasOwnProperty(id)) {
            if (vm.tournamentJson.blocks[id].location.x > max) {
              max = vm.tournamentJson.blocks[id].location.x;
            }
          }
        }
        max += 3;
        if (vm.gridsterOptions.columns !== max) {
          vm.gridsterOptions.columns = max;
        }
      }, true);
    }

    // wylacza 'active' we wskazanym bloczku
    function sleepBlock(idBlock) {
      vm.tournamentJson.blocks[idBlock].active = false;
    }

    function universalResizeGrid(blocks) {
      vm.gridsterOptions.columns = Math.max.apply(Math, Object.keys(blocks).map(function(key) {
          return blocks[key].location.x;
        })) + 1;
    }

    function checkIfBlockActive(blockID) {
      return (vm.tournamentJson.blocks[blockID].active && vm.edit && vm.tournamentJson.blocks[blockID].type !== 'randListBlock' || (!vm.edit && vm.tournamentJson.blocks[blockID].type === 'RR'));
    }

    function getConnections() {
      vm.connectionList = [].concat.apply([], Object.keys(vm.tournamentJson.blocks).filter(function(key) {
        return ['standings', 'startList'].indexOf(vm.tournamentJson.blocks[key].type) === -1;
      }).map(function(key) {
        return vm.tournamentJson.blocks[key].inputs.map(function(input, index) {
          return {
            from: {
              block: input.idBlock,
              pos: input.posInBlock
            },
            to: {
              block: key,
              pos: index
            }
          };
        });
      }));
    }

    function refreshTournament() {
      tournamentService.getTournament(vm.tournamentID).then(function(response) {
        if (response.success) {
          vm.tournamentJson = response.data;
          vm.showToast('Tournament has been refreshed');
        } else {
          vm.showToast('Refresh failed. Try again later');
        }
      });
    }
  }

})();
