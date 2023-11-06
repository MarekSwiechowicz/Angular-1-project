(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.tournament.edit')
    .directive('startListTournament', startListTournamentDirective);

  /** @ngInject */
  function startListTournamentDirective($mdDialog, utilsService) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        ngModel: '=',
        players: '='
      },
      controllerAs: 'vm',
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.players = $scope.players;
        vm.colors = utilsService.getBlockColors();

        vm.finished=function(){
          utilsService.getPositions($scope.ngModel);
        }


        //Data
        vm.block = $scope.ngModel;
        vm.players = $scope.players;
        vm.labelsHeight=utilsService.getBlockLabelsHeight();
        //Methods
        vm.playerName = playerName;
        //vm.isTextOverFlow = isTextOverFlow;

        function playerName(id) {
          return (vm.block.logic.rand) ? 'Random player' : 'Player ' + (id + 1);
        }

        jQuery.expr[':'].regex = function(elem, index, match) {
          var matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
              method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
              property: matchParams.shift().replace(validLabels, '')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
          return regex.test(jQuery(elem)[attr.method](attr.property));
        }

        $(document).ready(function() {

          $(':regex(class,player[0-9])').hover(
            function() {
              var $this = $(this);

              var names = $this[0].className.split(' '); // [class1, class2]
              var element;
              for (var i = 0; i < names.length; i++) {
                if (names[i].startsWith('p')) {
                  element = names[i];
                  break;
                }
              }
              element = '.' + element;

              $(element)
                //.data('prehovercolor', $(element).css('background'))
                .css({
                  'background-color': 'rgba(0,0,0,0.2)',
                	'font-weight': 'normal'
                });
            },
            function() {
              var $this = $(this);

              var names = $this[0].className.split(' ');
              var element;
              for (var i = 0; i < names.length; i++) {
                if (names[i].startsWith('player')) {
                  element = names[i];
                  break;
                }
              }
              element = '.' + element; //player234

              $(element)
              .css({
                'background-color': 'rgba(0,0,0,0)',
                'font-weight': 'normal'
              });
            }
          );
        });



        $(document).ready(function() {
          $('.notOverFlow').hover(function(i) {

            var element = $(this)
              .clone()
              .css({
                display: 'inline',
                width: 'auto',
                visibility: 'hidden'
              })
              .appendTo('body');

            if (element.width() > $(this).width()) {
              $(this).tooltip({content: $(this).attr('data-tooltip-value') });

            } else {
              if ($(this).data('ui-tooltip')) {
                $(this).tooltip('disable');
              }
            }
            element.remove();

          });
        });


      }]
    };
  }
})();
