(function() {
  'use strict';

  angular
    .module('app.template.edit')
    .controller('TemplateEditController', TemplateEditController);
  /** @ngInject */
  function TemplateEditController($mdSidenav, $scope, $timeout, $state, templateService, $mdDialog, $location, utilsService, userService, AuthService) {
    var vm = this;

    //Data
    vm.block = {};
    vm.lastValue = null;
    vm.templateID = $state.params.templateID;
    vm.startBlock = {
      "1": {
        "type": "startList",
        "name": "Start List",
        "id": 1,
        "output": [],
        "scores": [{
          "Uid": null,
          "available": true
        }, {
          "Uid": null,
          "available": true
        }, {
          "Uid": null,
          "available": true
        }, {
          "Uid": null,
          "available": true
        }, {
          "Uid": null,
          "available": true
        }, {
          "Uid": null,
          "available": true
        }],
        outputs: createOutpusArray(6),
        "location": {
          "x": 0,
          "y": 0
        },
        "size": {
          "width": 1,
          "height": 6 + 3
        },
        "logic": {
          "numberOfPlayers": 6,
          "rand": false
        },
        "active": true
      }
    };

    vm.isNewTemplate = false;
    vm.edit = false;
    vm.isOwner = false;

    var sizeJson = 1; // Jedynka wynika z tego, że dodajemy na starcie gotową start listę
    if ($state.params.templateID !== '') {
      if ($state.current.data.edit) { // tutaj następuje rozróżnienie pomiędzy widokiem edycji/podglądu
        vm.edit = true;
      } else {
        vm.edit = false;
      }
      templateService.getTemplate(vm.templateID).then(function(response) {
        if (response.success) {
          vm.templateJson = response.data;
          vm.isOwner = userService.isOwner(vm.templateJson);
          if (!vm.isOwner && vm.templateJson.private) {
            utilsService.showToast('You are not permitted to see this template');
            $location.path('/list-template/');
          } else if (!vm.isOwner && vm.edit) {
            utilsService.showToast('You are not permitted to edit this template');
            $location.path('/list-template/');
          }
          if (Object.keys(vm.templateJson.blocks).length) {
            sizeJson = Object.keys(vm.templateJson.blocks)[Object.keys(vm.templateJson.blocks).length - 1]; // zwraca id ostatniego bloku
          } else {
            sizeJson = 0;
          }
          universalResizeGrid();
          watchInit();
        } else {
          utilsService.showToast(response.message);
          $location.path('/list-template/');
        }
      });
    } else {
      vm.edit = true;
      vm.isOwner = true;
      vm.isNewTemplate = true;
      vm.templateJson = {
        "type": "template",
        "name": "",
        "numberOfPlayers": 0,
        "players": [],
        "private": false,
        "valid": true,
        "blocks": angular.copy(vm.startBlock)
      };
      watchInit();
    }

    vm.colors = utilsService.getBlockColors();
    vm.showSidenav = true;

    // $scope.$watch('vm.templateJson.blocks', function(blocks) {
    //     // creatArrayWithBlocksAndPositions(); // Do wywalenia po selectcie
    //     // getAvailableBlocksToArray(); // Do wywalenia po selectcie
    //   }, true);

    vm.getWidth = getWidth;
    vm.pair = {
      input: {
        idBlock: null,
        posInBlock: null
      },
      output: {
        idBlock: null,
        posInBlock: null
      }
    };

    vm.gridsterOptions = {
      margins: [0, 10],
      columns: 5,
      floating: false,
      colWidth: 250,
      rowHeight: 21,
      pushing: false,
      maxRows: 200,
      maxSizeX: 1,
      outerMargin: false,
      draggable: {
        handle: 'div',
        enabled: vm.edit
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
    vm.blocksArray = [];
    vm.positionsArray = [];

    vm.arrays = {
      blocksArray: vm.blocksArray,
      positionsArray: vm.positionsArray
    };

    vm.arrayWithBlocksAndPositions = {};
    vm.availableBlocks = [];

    var input = {
      idBlock: null,
      posInBlock: null,
      Uid: null
    };

    var score = {
      Uid: null,
      result: null,
      available: true
    };

    var startScore = {
      Uid: null,
      available: true
    };

    //Methods
    vm.toggleOptionsSidenav = toggleOptionsSidenav;
    vm.isLogged = AuthService.isLogged;
    vm.addRRBlock = addRRBlock;
    vm.addStandingsBlock = addStandingsBlock;
    vm.addRandListBlock = addRandListBlock;
    vm.addStartListBlock = addStartListBlock;
    vm.addVsBlock = addVsBlock;
    vm.addCompetitionBlock = addCompetitionBlock;
    vm.duplicateFunction = duplicateFunction;
    vm.verifyAvailables = verifyAvailables;
    vm.removeBlock = removeBlock;
    vm.addInputs = addInputs;
    vm.clear = clear;
    vm.setOutputs = setOutputs;
    vm.showToast = utilsService.showToast;
    vm.deleteConnections = deleteConnections;
    vm.createTemplate = createTemplate;
    vm.updateTemplate = updateTemplate;
    vm.removeTemplate = removeTemplate;
    vm.validateTemplate = validateTemplate;
    vm.validateTemplateName = validateTemplateName;
    vm.runTemplate = runTemplate;
    vm.editTemplate = editTemplate;
    vm.addToMyTemplates = addToMyTemplates;
    vm.loadCompetitionList = loadCompetitionList;
    vm.getNameById = getNameById;
    vm.close = close;
    vm.setPlayersInJson = setPlayersInJson;
    vm.showDetailsOfBlock = showDetailsOfBlock;
    vm.resetBlock = resetBlock;
    vm.allCompetitions = {
      tab: []
    };
    vm.blockFunctions = {
      deleteFunction: vm.removeBlock,
      getAvailableCompetitions: getAvailableCompetitions,
      verifyAvailables: vm.verifyAvailables,
      duplicateFunction: vm.duplicateFunction,
      deleteConnections: vm.deleteConnections,
      getNameById: vm.getNameById,
      allCompetitions: vm.allCompetitions,
      arrayWithBlocksAndPositions: vm.arrayWithBlocksAndPositions,
      availableBlocks: vm.availableBlocks,
      loadCompetitionList: vm.loadCompetitionList,
      pair: vm.pair
    };

    var initialPosition = pushDown;

    
    $('#show-sidenav').on('click',function(){
      (function toggleIcon(){
        $('#show-sidenav >').toggleClass('icon-cog');
        $('#show-sidenav >').toggleClass('icon-arrow-right');
      })();

      var sidenav = $('#options-sidenav');
      // sidenav.animate({
      //   //width: [ "toggle", "swing" ],
      //   left: '-10px',
      //   opacity: 'toggle'
      // }, 700,'linear', function() {
      //   // toggleIcon();
      // });    
      sidenav.toggle('slide',{direction:'right'},500);
    });

    function toggleOptionsSidenav() {
    }

    function setPlayersInJson() {
      vm.deleteConnections(vm.block.id);
      var iter = vm.block.logic.numberOfPlayers;
      var score1 = {
       Uid: null,
       available: true
      };
      var score2 = {
       Uid: null,
       result: null,
       available: true
      };
      var input1 = {
       idBlock: null,
       posInBlock: null,
       Uid: null,
       available: false
      };
      var standingsInput = {
       idBlock: null
      };


      if (vm.block.type === 'startList' ) {
       vm.block.scores = [];
       vm.block.outputs = [];


       while (iter--) {
          vm.block.scores.push(angular.copy(score1));
          vm.block.outputs.push(angular.copy(input1));

       }
      } else if (vm.block.type === 'RR' || vm.block.type === 'competition' || vm.block.type === 'randListBlock') {
       vm.block.inputs = [];
       vm.block.scores = [];
       vm.block.outputs = [];

       while (iter--) {
          vm.block.scores.push(angular.copy(score2));
          vm.block.inputs.push(angular.copy(input1));
          vm.block.outputs.push(angular.copy(input1));

       }
      } else if (vm.block.type === 'versus') {
       vm.block.inputs = [];
       vm.block.scores = [];
       vm.block.outputs = [];

       var iterVs = 2;
       while (iterVs--) {
          vm.block.scores.push(angular.copy(score2));
          vm.block.inputs.push(angular.copy(input1));
          vm.block.outputs.push(angular.copy(input1));

       }
      } else if (vm.block.type === 'standings') {
       vm.block.standingsInputs = [];
       while (iter--) {
          vm.block.standingsInputs.push(angular.copy(standingsInput));
       }
      }
   }

   function setBlockHeight() {
    vm.block.size.height = vm.block.scores.length + 3;
   }

    function close() {
        if( vm.block.scores.length !== vm.block.logic.numberOfPlayers && vm.block.type !== 'versus') {
            setPlayersInJson();
            setBlockHeight();
        }
    }

    function showDetailsOfBlock(block, event) {
      vm.block = block;
      event.stopPropagation();
    }

    function resetBlock() {
      vm.block = {};
    }

    function watchInit() {
      $scope.$watchCollection(function() {
        return Object.keys(vm.templateJson.blocks).map(function(key) {
          return vm.templateJson.blocks[key].location.x;
        });
      }, function() {
        universalResizeGrid(); //funkcja rozszerzajaca pole w prawo
      });

      $scope.$watchCollection(function() {
        return Object.keys(vm.templateJson.blocks).filter(function(blockID) {
          return vm.templateJson.blocks[blockID].inputs !== undefined;
        }).map(function(blockID) {
          return vm.templateJson.blocks[blockID].inputs;
        });
      }, function() {
         validateTemplate();
      });

      $scope.$watch('vm.pair', function() {
        savePair();
         validateTemplate();
      }, true);
    }

    function addVsBlock() {
      sizeJson++;
      var vsBlock = {
        type: 'versus',
        name: '1 vs 1',
        id: sizeJson,
        inputs: createInputArray(2),
        scores: createScoreArray(2),
        outputs: createOutpusArray(2),
        RRid: null,
        output: [],
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 2 + 3
        },
        logic: {
          sort: 'desc'
        },
        active: false
      };
      initialPosition(vsBlock);
      vm.templateJson.blocks[sizeJson] = vsBlock;
    }

    function addCompetitionBlock() {
      sizeJson++;
      var vsBlock = {
        type: 'competition',
        name: 'Competition',
        id: sizeJson,
        inputs: createInputArray(6),
        scores: createScoreArray(6),
        outputs: createOutpusArray(6),
        output: [],
        standingsOutput: [],
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 6 + 3
        },
        logic: {
          sort: 'desc',
          numberOfPlayers: 6
        },
        active: false
      };
      initialPosition(vsBlock);
      vm.templateJson.blocks[sizeJson] = vsBlock;
      loadCompetitionList();
    }

    function addStartListBlock() {
      sizeJson++;
      var startListBlock = {
        type: 'startList',
        name: 'Start List',
        id: sizeJson,
        output: [],
        scores: [
          angular.copy(startScore),
          angular.copy(startScore),
          angular.copy(startScore),
          angular.copy(startScore),
          angular.copy(startScore),
          angular.copy(startScore)
        ],
        outputs: createOutpusArray(6),
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 6 + 3
        },
        logic: {
          numberOfPlayers: 6,
          rand: false
        },
        active: true
      };
      initialPosition(startListBlock);
      vm.templateJson.blocks[sizeJson] = startListBlock;
    }

    function addRandListBlock() {
      sizeJson++;
      var randListBlock = {
        type: 'randListBlock',
        name: 'Rand List',
        id: sizeJson,
        inputs: createInputArray(4),
        scores: createScoreArray(4),
        outputs: createOutpusArray(4),
        matches: [],
        output: [],
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 4 + 3
        },
        logic: {
          numberOfPlayers: 4,
          rand: false
        },
        active: false
      };
      initialPosition(randListBlock);
      vm.templateJson.blocks[sizeJson] = randListBlock;
    }

    function getNameById(id) {
      return vm.templateJson.blocks[id].name;
    }
    function loadCompetitionList() {
      var all = [];
      var one = {};
      all = getAvailableCompetitions();

      vm.allCompetitions.tab = Object.keys(vm.templateJson.blocks).filter(function(key) {
        return vm.templateJson.blocks[key].type === 'competition';
      });
    }


    function addStandingsBlock() {
      sizeJson++;
      var standingsBlock = {
        type: 'standings',
        name: 'Standings',
        id: sizeJson,
        standingsInputs: [],
        scores: [],
        output: [],
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 10 + 3
        },
        logic: {
          sort: 'desc'
        },
        active: false
      };
      initialPosition(standingsBlock);
      vm.templateJson.blocks[sizeJson] = standingsBlock;
    }

    function addRRBlock() {
      sizeJson++;
      var RRBlock = {
        type: 'RR',
        name: 'Round Robin',
        id: sizeJson,
        inputs: createInputArray(4),
        scores: createScoreArray(4),
        outputs: createOutpusArray(4),
        matches: [],
        output: [],
        location: {
          x: 0,
          y: 0
        },
        size: {
          width: 1,
          height: 4 + 3
        },
        logic: {
          sort: 'desc',
          numberOfPlayers: 4,
          numberOfRounds: 1,
          modWritesPkt: 'false',
          wPkt: 3,
          dPkt: 1,
          lPkt: 0
        },
        active: false
      };
      initialPosition(RRBlock);
      vm.templateJson.blocks[sizeJson] = RRBlock;
    }

    function createInputArray(number) {
      var inputArray = [];
      while (number--) {
        inputArray.push(angular.copy(input));
      }
      return inputArray;
    }

    function createOutpusArray(number) {
      var scoreArray = [];
      var output = {
        idBlock: null,
        posInBlock: null,
        Uid: null,
        available: false
      };
      while (number--) {
        scoreArray.push(angular.copy(output));
      }
      return scoreArray;
    }

    function createScoreArray(number) {
      var scoreArray = [];
      while (number--) {
        scoreArray.push(angular.copy(score));
      }
      return scoreArray;
    }

    function duplicateFunction(block) {
      sizeJson++;
      var newBlock = angular.copy(block);
      newBlock.id = sizeJson;

      for (var input in newBlock.inputs) {
        var number = Number(input);
        var oneInput = newBlock.inputs[number];
        oneInput.idBlock = null;
        oneInput.posInBlock = null;
        oneInput.available = false;
      }

      for (var input in newBlock.outputs) {
        var number = Number(input);
        var oneOutput = newBlock.outputs[number];
        oneOutput.idBlock = null;
        oneOutput.posInBlock = null;
        oneOutput.available = false;

      }

      for (var score in newBlock.scores) {
        var number1 = Number(score);
        newBlock.scores[number1].available = true;
      }

      newBlock.output = [];
      if (newBlock.type === 'standings') {
        newBlock.standingsInputs = [];
      } else if (newBlock.type === 'competition') {
        newBlock.standingsOutput = [];
      }
      newBlock.location = {
        x: block.location.x,
        y: 0
      };
      pushDuplicated(newBlock, block.id);
      vm.templateJson.blocks[sizeJson] = newBlock;
      if (newBlock.type === 'competition') {
        loadCompetitionList();
      }
    }

    function verifyAvailables() {
      for (var blockId in vm.templateJson.blocks) {
        var block = vm.templateJson.blocks[blockId];

        for (var iD in block.scores) {
          var score = block.scores[iD];
          score.available = true;
        }
      }
      for (var blockId1 in vm.templateJson.blocks) {
        var block1 = vm.templateJson.blocks[blockId1];
        if (block1.type !== 'startList') {

          for (var id in block1.inputs) {
            var input = block1.inputs[id];
            if (input.idBlock && input.posInBlock) {
              vm.templateJson.blocks[input.idBlock].scores[input.posInBlock - 1].available = false;
            }
          }
        }
      }
    }

    function creatArrayWithBlocksAndPositions() {
      for (var idBlock in vm.templateJson.blocks) {
        if (vm.templateJson.blocks.hasOwnProperty(idBlock)) {
          var block = vm.templateJson.blocks[idBlock];
          if (block.type !== 'standings') {
            vm.arrayWithBlocksAndPositions[block.id] = {};
            var iter = 1;
            vm.arrayWithBlocksAndPositions[block.id] = block.scores.map(function(score) {
              score = {
                posInBlock: iter++,
                available: score.available
              };
              return score;
            });
          }
        }
      }
    }

    function getAvailableBlocksToArray() {
      vm.availableBlocks.length = 0;
      for (var id in vm.templateJson.blocks) {
        if (vm.templateJson.blocks.hasOwnProperty(id)) {
          var block = vm.templateJson.blocks[id];
          if (block.type !== 'standings') {
            for (var idScore in block.scores) {
              if (block.scores[idScore].available) {
                vm.availableBlocks.push(block.id);
                break;
              }
            }
          }
        }
      }
    }

    function getAvailableCompetitions() {
      var availableBlocks = [];
      for (var id in vm.templateJson.blocks) {
        if (vm.templateJson.blocks.hasOwnProperty(id)) {
          var block = vm.templateJson.blocks[id];
          if (block.type === 'competition') {
            availableBlocks.push(block.id);
          }
        }
      }
      return availableBlocks;
    }

    function removeBlock(index) {
        if(vm.pair.input.idBlock){
            vm.templateJson.blocks[vm.pair.input.idBlock].outputs[vm.pair.input.posInBlock-1] = false;
            clearObject(vm.pair.input);
        }
        if(vm.pair.output.idBlock){
            vm.templateJson.blocks[vm.pair.output.idBlock].inputs[vm.pair.output.posInBlock-1] = false;
            clearObject(vm.pair.output);
        }
      deleteConnections(index);
      var reloadCompetitionList = (vm.templateJson.blocks[index].type === 'competition');
      delete vm.templateJson.blocks[index];

    //   clearObject(vm.pair.output);
      if (reloadCompetitionList) {
        loadCompetitionList();
      }
    }

    function deleteConnections(index) {
      for (var idInput in vm.templateJson.blocks[index].inputs) {
        var idBlock = vm.templateJson.blocks[index].inputs[idInput].idBlock;
        var posInBlock = vm.templateJson.blocks[index].inputs[idInput].posInBlock;
        if (idBlock && posInBlock) {
          vm.templateJson.blocks[idBlock].scores[Number(posInBlock) - 1].available = true;
          vm.templateJson.blocks[idBlock].outputs[Number(posInBlock) - 1].available = false;
          //   vm.templateJson.blocks[idBlock].inputs[Number(posInBlock) - 1].available = false;

        }
      }

      for (var idBlock in vm.templateJson.blocks) {
        for (var idInput in vm.templateJson.blocks[idBlock].inputs) {
          var input = vm.templateJson.blocks[idBlock].inputs[idInput];
          if (input.idBlock == index) {
            input.idBlock = null;
            input.posInBlock = null;
            input.available = false;
          }
        }
      }

      for (var idBlock in vm.templateJson.blocks) {
        for (var idInput in vm.templateJson.blocks[idBlock].outputs) {
          var input = vm.templateJson.blocks[idBlock].outputs[idInput];
          if (input.idBlock == index) {
            input.idBlock = null;
            input.posInBlock = null;
            input.available = false;
          }
        }
      }

      if (vm.templateJson.blocks[index].type === 'competition') {
        var deleteBlock = vm.templateJson.blocks[index];
        for (var id in vm.templateJson.blocks) {
          var standingsBlock = vm.templateJson.blocks[id];
          if (standingsBlock.type === 'standings') {
            deleteStandingsConnections(standingsBlock.standingsInputs, deleteBlock.id);
          }
        }
      }

      if (vm.templateJson.blocks[index].type === 'standings') {
        var deleteBlock1 = vm.templateJson.blocks[index];
        for (var standingsId in deleteBlock1.standingsInputs) {
          var obj = vm.templateJson.blocks[deleteBlock1.standingsInputs[Number(standingsId)]];
          if (obj.standingsOutput !== []) {
            obj.standingsOutput.splice(obj.standingsOutput.indexOf(index), 1);
          }
        }
      }

    }

    function deleteStandingsConnections(array, elementToDelete) {
      if (array.indexOf(elementToDelete) !== -1) {
        array.splice(array.indexOf(elementToDelete), 1);
      }
    }

    function createTemplate() {
      vm.setOutputs();
      if (vm.validateTemplateName()) {
        templateService.createTemplate(vm.templateJson).then(function(response) {
          if (response.success) {
            vm.showToast('Your template has been created.');
            $location.path('/list-template/');
          } else {
            vm.showToast(response.message);
          }
        });
      }
    }

    function updateTemplate() {
      vm.setOutputs();
      if (vm.validateTemplateName()) {
        templateService.updateTemplate(vm.templateID, vm.templateJson).then(function(response) {
          if (response.success) {
            vm.showToast('Your template has been saved.');
          } else {
            vm.showToast(response.message);
          }
        });
      }
    }

    function addInputs(block, line, idBlock, posInBlock) {
      var indexInBlocks = block.id;
      var input = {
        idBlock: idBlock,
        posInBlock: posInBlock,
        Uid: null
      };
      vm.templateJson.blocks[indexInBlocks].inputs[line - 1] = input;
      vm.templateJson.blocks[idBlock].output.push(indexInBlocks);
    }

    function clear() {
      vm.templateJson.blocks = angular.copy(vm.startBlock);
      vm.block = {};
      sizeJson = 1;
    }

    function removeTemplate() {
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The template will be deleted.')
        .ariaLabel('Delete template')
        .ok('Delete')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        templateService.deleteTemplate($state.params.templateID).then(function() {
          vm.showToast('Template has been deleted.');
          $location.path('/list-template/');
        })
      })
    }

    function setOutputs() {

      for (var id in vm.templateJson.blocks) {
        if (!vm.templateJson.blocks.hasOwnProperty(id)) {
          continue;
        }
        var block = vm.templateJson.blocks[id];
        block.output = [];
        if (block.type === 'competition') {
          block.standingsOutput = [];
        }
      }

      for (var id in vm.templateJson.blocks) {
        if (!vm.templateJson.blocks.hasOwnProperty(id)) {
          continue;
        }
        var block = vm.templateJson.blocks[id];
        if (block.type !== 'standings') {
          for (var input in block.inputs) {
            var number = Number(input);
            var oneInput = block.inputs[number];
            if (oneInput.idBlock) {
              if (oneInput.idBlock !== '' && !vm.templateJson.blocks[oneInput.idBlock].output.includes(Number(block.id))) {
                vm.templateJson.blocks[oneInput.idBlock].output.push(block.id);
              }
            }
          }
          if (block.type === 'RR') {
            var rounds = Number(block.logic.numberOfRounds);
            var numberOfPlayers = Number(block.logic.numberOfPlayers),
              iter;

            if (numberOfPlayers % 2 === 0) {
              iter = numberOfPlayers - 1;
            } else {
              iter = numberOfPlayers;
            }

            for (var i = 0; i < iter * rounds; i++) {
              vm.templateJson.blocks[block.id].matches[i] = [];
            }

            for (var i = 0; i < rounds; i++) {
              doRR(block, i, iter);
            }
          } else if (block.type === 'startList') {
            vm.templateJson.players = [];
            vm.templateJson.numberOfPlayers = block.logic.numberOfPlayers;
            for (var j = 0; j < vm.templateJson.numberOfPlayers; j++) {
              var player = {
                _id: null,
                name: null
              };
              vm.templateJson.players.push(player);
            }
          }
        } else { //block.type===standings
          for (var input in block.standingsInputs) {
            vm.templateJson.blocks[block.standingsInputs[Number(input)]].standingsOutput.push(block.id);
          // block.scores[Number(input)]={};
          }
        }
      }
    }

    // checks whether all block inputs are non-empty and whether template contains a cycle
    function isValidTemplate(template) {
        function returnJson(isValid, message) {
            return {
                isValid: isValid,
                message: message
            };
        }


        // findCycle() variables
        var marked = [];
        var hasCycle = false;
        var onStack = [];

        // isValidTemplate() helper function - checks whether template contains a cycle, v is starting node
        function findCycle(v, template) {
            marked[v] = true;
            onStack[v] = true;
            if (template.blocks && template.blocks[v] && template.blocks[v].output) {
                for (var i = 0; i < template.blocks[v].output.length; i++) {
                    var w = template.blocks[v].output[i];
                    if (!marked[w]) {
                        findCycle(w, template);
                    } else if (onStack[w]) {
                        hasCycle = true;
                        return;
                    }
                }
                onStack[v] = false;
            }
        }

        if(!template){
          return returnJson(false, 'No template');
        }

        findCycle(1, template);
        if (hasCycle) {
            return returnJson(false, "Template has cycle");
        }

        var blocks = template.blocks;

        if(blocks){
            for(var key in blocks){
              // skip loop if the property is from prototype
              if (!blocks.hasOwnProperty(key) || blocks[key].type === 'standings') continue;
              if(marked[key] !== true){
                return returnJson(false, 'Blocks not connected');
              }
            }
        }

        for (var key1 in blocks) {
            if (blocks.hasOwnProperty(key1)) {
                var blockInputs = blocks[key1].inputs;
                // if inputs exist
                if (blockInputs) {
                    for (var i = 0; i < blockInputs.length; i++) {
                        // if an input is empty or its fields are empty
                        if (!blockInputs[i] || !blockInputs[i].idBlock || !blockInputs[i].posInBlock) {
                            return returnJson(false, 'Not all inputs are assigned');
                        }
                    }
                } else {

                    // if a block doesn't have inputs and is not a startList nor standings
                    if (blocks[key1].type !== 'startList' && blocks[key1].type !== 'standings') {
                        return returnJson(false, 'Not all inputs are assigned');
                    }
                }
            }
        }
        return returnJson(true, 'Template is valid');
    }

    function validateTemplate() {
      setOutputs();
      var valid = isValidTemplate(vm.templateJson);
      vm.templateJson.valid = valid.isValid;
      vm.validMessage = valid.message;
    // vm.showToast(vm.validMessage + ' : ' + vm.templateJson.valid);
    }

    function validateTemplateName() {
      if (!vm.templateJson.name) {
        vm.showToast('You need to enter the name of template first');
        return false;
      } else {
        return true;
      }
    }


    // function universalResizeGrid(blocks) {
    function universalResizeGrid() {
      var blocks = vm.templateJson.blocks;
      vm.gridsterOptions.columns = Math.max.apply(Math, Object.keys(blocks).map(function(key) {
          return blocks[key].location.x;
        }))+3;
    }

    function getWidth() { //funkcja zwracajaca rozmiar do diva, ktory rozszerza pole w prawo
      var width = vm.gridsterOptions.columns * (vm.gridsterOptions.colWidth + vm.gridsterOptions.margins[0]) + vm.gridsterOptions.margins[0];
      return 'width: ' + width + 'px;';
    }

    function savePair() {
      var pairInput = vm.pair.input;
      var pairOutput = vm.pair.output;
      if (pairInput.idBlock > 0 && pairOutput.idBlock > 0) {
        vm.templateJson.blocks[pairOutput.idBlock].inputs[pairOutput.posInBlock - 1].idBlock = pairInput.idBlock;
        vm.templateJson.blocks[pairOutput.idBlock].inputs[pairOutput.posInBlock - 1].posInBlock = pairInput.posInBlock;
        vm.templateJson.blocks[pairInput.idBlock].outputs[pairInput.posInBlock - 1].idBlock = pairOutput.idBlock;
        vm.templateJson.blocks[pairInput.idBlock].outputs[pairInput.posInBlock - 1].posInBlock = pairOutput.posInBlock;
        clearObject(pairOutput);
        clearObject(pairInput);
      } else if (pairInput.idBlock < 0) {
        for (var idOut in vm.templateJson.blocks) {
          if (vm.templateJson.blocks[idOut].type !== 'startList' && vm.templateJson.blocks[idOut].type !== 'standings') {
            var outputs = vm.templateJson.blocks[idOut].inputs;
            outputs.map(function(output) {
              if (output.idBlock === -(pairInput.idBlock) && output.posInBlock === -(pairInput.posInBlock)) {
                clearObject(pairInput);
                clearObject(output);
                output.available = !output.available;
              }
            });
          }
        }
      } else if (pairOutput.idBlock < 0) {
        for (var idOut in vm.templateJson.blocks) {
          if (vm.templateJson.blocks[idOut].type !== 'standings') {
            var outputs = vm.templateJson.blocks[idOut].outputs;
            outputs.map(function(output) {
              if (output.idBlock === -(pairOutput.idBlock) && output.posInBlock === -(pairOutput.posInBlock)) {
                clearObject(pairOutput);
                clearObject(output);
                output.available = !output.available;
              }
            });
          }
        }
      }
    }

    function clearObject(object) {
      object.idBlock = null;
      object.posInBlock = null;
    }

    function createMatch(RRid, teamA, teamB) {
      var scoreMatch = {
          Uid: null,
          result: null
        };
      var vsBlock = {
        inputs: [{
          idBlock: null,
          posInBlock: null,
          localId: teamA,
          Uid: null
        }, {
          idBlock: null,
          posInBlock: null,
          localId: teamB,
          Uid: null
        }],
        scores: [
          angular.copy(scoreMatch),
          angular.copy(scoreMatch)
        ],
        RRid: RRid,
      };
      return vsBlock;
    }

    function doRR(block, loop, iter) {
      var numberOfPlayers = Number(block.logic.numberOfPlayers);
      var res = roundRobin(numberOfPlayers);

      for (var i = 0; i < res.length; i++) {
        if (res[i].a !== '_A' && res[i].b !== '_A') {
          var number = res[i].r;
          vm.templateJson.blocks[block.id].matches[Number(res[i].r) - 1 + iter * loop].push(createMatch(block.id, res[i].a, res[i].b));
        }
      }
    }

    function pushRight(block) {
      //dzika funkcja do umieszczenia bloku w pierwszym możliwym miejscu u góry
      //do wywalenia w przyszłości
      block.location.x = Object.keys(vm.templateJson.blocks).filter(function(key) {
        return vm.templateJson.blocks[key].location.y > block.size.height;
      }).sort(function(a, b) {
        if (a < b) {

          return 1;
        }
        return -1;
      }).concat([0]).slice(0, 1).map(function(key) {
        if (key) {
          return vm.templateJson.blocks[key].location.x;
        } else {
          return 0;
        }
      }).pop()
    }

    function pushDown(block) {
          vm.block = block;
      //trochę dzika funkcja umieszczająca blok
      var sortedKeys = Object.keys(vm.templateJson.blocks).filter(function(key) {
        return vm.templateJson.blocks[key].location.x === 0;
      }).sort(function(a, b) {
        if (vm.templateJson.blocks[a].location.y > vm.templateJson.blocks[b].location.y) {
          return 1;
        }
        return -1;
      });
      if (!sortedKeys.length || vm.templateJson.blocks[sortedKeys[0]].location.y >= block.size.height) {
        block.location.y = 0;
        return;
      }
      for (var i = 0; i < sortedKeys.length - 1; i++) {
        if (vm.templateJson.blocks[sortedKeys[i]].location.y + vm.templateJson.blocks[sortedKeys[i]].size.height + block.size.height - vm.templateJson.blocks[sortedKeys[i + 1]].location.y <= 0) {
          block.location.y = vm.templateJson.blocks[sortedKeys[i]].location.y + vm.templateJson.blocks[sortedKeys[i]].size.height;
          return;
        }
      }
      block.location.y = vm.templateJson.blocks[sortedKeys[sortedKeys.length - 1]].location.y + vm.templateJson.blocks[sortedKeys[sortedKeys.length - 1]].size.height;
      return;
    }

    function pushRightHard(block) {
      //funkcja umieszczająca blok w nowoutworzonej kolumnie z prawej
      block.location = {
        x: vm.gridsterOptions.columns-2,
        y: 0
      }
      return;
    }

    function pushDuplicated(block, parentKey) {
      //kolejna dzika funkcja, tym razem umieszczająca zduplikowany blok
      var sortedKeys = Object.keys(vm.templateJson.blocks).filter(function(key) {
        return (vm.templateJson.blocks[parentKey].location.x === vm.templateJson.blocks[key].location.x) && (vm.templateJson.blocks[key].location.y >= vm.templateJson.blocks[parentKey].location.y);
      }).sort(function(a, b) {
        if (vm.templateJson.blocks[a].location.y > vm.templateJson.blocks[b].location.y) {
          return 1;
        }
        return -1;
      });
      for (var i = 0; i < sortedKeys.length - 1; i++) {
        if (vm.templateJson.blocks[sortedKeys[i]].location.y + vm.templateJson.blocks[sortedKeys[i]].size.height + block.size.height - vm.templateJson.blocks[sortedKeys[i + 1]].location.y <= 0) {
          block.location.y = vm.templateJson.blocks[sortedKeys[i]].location.y + vm.templateJson.blocks[sortedKeys[i]].size.height;
          return;
        }
      }
      block.location.y = vm.templateJson.blocks[sortedKeys[sortedKeys.length - 1]].location.y + vm.templateJson.blocks[sortedKeys[sortedKeys.length - 1]].size.height;
      return;
    }

    function roundRobin(t) {
      var e = [],
        p = +t + (t % 2),
        a = new Array(p - 1),
        l = a.length,
        pos,
        i,
        r,
        pos2;

      for (var x = p; x--;) {
        a[x] = (x + 1) // tablica z numerami graczy
      }
      p ^ t && (a[p - 1] = "_"); // ewentualne uzupełnienie tablicy przez "_", gdy liczba graczy jest nieparzysta
      for (var r = 1; r < l + 1; r++) {
        e.push({
          r: r,
          a: a[0] + 'A',
          b: a[l - (r - 1)] + 'A',
          forek: 1
        });
        for (var i = 2; i < (p / 2) + 1; i++) {
          pos = (i + (r - 2)) >= l ? ((l - (i + (r - 2)))) * -1 : (i + (r - 2));
          pos2 = (pos - (r - 2)) - r;
          pos2 > 0 && (pos2 = (l - pos2) * -1);
          pos2 < (l * -1) && (pos2 += l);
          e.push({
            r: r,
            a: a[(l + pos2)] + 'A',
            b: a[(l - pos)] + 'A',
            pos: pos,
            pos2: pos2
          });
        }
      }
      return e;

    }

    function runTemplate() {
      if (vm.isLogged()) {
        if (vm.templateJson.valid) {
        $mdDialog.show({
          controller: 'AdminPanelController',
          controllerAs: 'vm',
          templateUrl: 'app/main/tournament/edit-tournament/dialogs/admin-panel.html',
          clickOutsideToClose: true,
          locals: {
            tournament: null,
            template: vm.templateJson
          }
        });
      } else {
        vm.showToast('Template is not valid. You need to edit template first');
      }
      } else {
        vm.showToast('You have to login first');
      }
    }

    function editTemplate() {
      $location.path('/edit-template/' + vm.templateJson._id);
    }

    function addToMyTemplates() {
      if (vm.isLogged()) {
        templateService.addToMyTemplates(vm.templateJson._id).then(function(response) {
          if (response.success) {
            vm.showToast('Template has been added to yours');
            $location.path('/list-template/');
          } else {
            vm.showToast(response.message);
          }
        });
      } else {
        vm.showToast('You have to login first');
      }
    }

  }
})();
