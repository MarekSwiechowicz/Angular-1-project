(function() {
  'use strict';

  angular
    .module('app.custom-services')
    .service('utilsService', utilsService);

  /** @ngInject */
  function utilsService($mdToast, $q, $timeout) {
    var service = this;
    service.positions = {
      obj: {},
      do: false
    };

    var blockLabelHeight=21;
    var blockLabelWidth=238;

    return {
      showToast: showToast,
      showDatabaseProblem: showDatabaseProblem,
      getBlockColors: getBlockColors,
      getBlockWidth: getBlockWidth,
      getBlockHeaderHeight: getBlockHeaderHeight,
      getBlockLabelsHeight: getBlockLabelsHeight,
      getPositions: getPositions,
      positions: service.positions,
      clearPositions: clearPositions
    };

    function showToast(text) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(text)
        .position('top center')
        .hideDelay(5000)
      );
    }

    function showDatabaseProblem() {
      $mdToast.show(
        $mdToast.simple()
        .textContent('HOLY SHIT! There\'s a database connection problem. :(')
        .position('top center')
        .hideDelay(5000)
      );
    }

    function getBlockWidth() {
      return 'width:'+blockLabelWidth+'px;';
    }

    function getBlockHeaderHeight() {
      return 'height:25px;';
    }


    function getBlockLabelsHeight() {
      return 'height:'+blockLabelHeight+'px;';
    }

    function getBlockColors() {
      return {
        'versus': ['#1F911F', '#5CC45C', '#8CDC8C'],
        'RR': ['#8A7F4A', '#D0C698', '#FBF4D4'],
        'competition': ['#4E335C', '#7E638C', '#AE93BC'],
        'standings': ['#36425D', '#6A748B', '#9198A8'],
        'randListBlock': ['#8A4C4A', '#D09998', '#FBD5D4'],
        'startList': ['#807A15', '#D4CF6A', '#FFFBAA'],
        'background': ['#A1A1A1', '#f2f2f2', '#FFFFFF'],
        'saveButton': '',
        'clearButton': '#e0e0e0',
        'deleteButton': '#FF0000',
        'badge': '#F44336',
        'header': [],
        'text': {
          red: '#FF0000',
          white: '#FFFFFF',
          black: '#000000'
        }
      };
    }

    function clearPositions(){
      service.positions.obj={};
    }
    function getPositions(block) {
      var hasInput = ['startList'].indexOf(block.type) === -1;
      $timeout(function() {
        var blockLocation = angular.element('#' + block.id).position();
        service.positions.obj[block.id] = block.scores.map(function(el, index) {
          var input = hasInput ? angular.element('#in' + block.id + '_' + index).position() : null;
          var output = angular.element('#out' + block.id + '_' + index).position();

          return {  input: hasInput ? {
              top: blockLocation.top + input.top + blockLabelHeight/2,
              left: blockLocation.left + input.left
            } : null,
            output: {
              top: blockLocation.top + (hasInput ? input.top : output.top) + blockLabelHeight/2,
              left: blockLocation.left + (hasInput ? input.left : output.left) + 240
             }
          }
        })
      }, 2000)
    }
  }
})();
