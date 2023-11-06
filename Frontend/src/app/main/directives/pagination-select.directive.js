(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular
    .module('app.custom-directives')
    .directive('paginationSelect', paginationSelectDirective);

  /** @ngInject */
  function paginationSelectDirective($document) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
      scope: {
        name: '=',
        source: '=',
        ngModel: '='
      },
      controllerAs: 'vm',
      link: function($scope, iElement, attrs, model) {
        if ('multiple' in attrs) {
          $scope.multiple = true;
        } else {
          $scope.multiple = false;
        }
      },
      controller: ['$scope', function($scope) {
        var vm = this;

        //Data
        if ($scope.ngModel) {
          if (Array.isArray($scope.ngModel)) {
            vm.list = $scope.ngModel;
            vm.fullList = $scope.ngModel;
            vm.selectedId = vm.list.map(function(element) {
              return element._id;
            });
          }
          else if ((typeof $scope.ngModel === 'object') && ($scope.ngModel !== null)) {
            vm.list = ($scope.ngModel._id) ? [$scope.ngModel] : [];
          }
        }
        else {
          if ($scope.multiple) {
            $scope.ngModel = [];
            vm.fullList = [];
            vm.selectedId = [];
          }
          else {
            $scope.ngModel = {};
          }
        }

        vm.placeholder = 'Search for ' + $scope.name;
        vm.filter = {
          search: '',
          page: 1,
          recordsOnPage: 4,
          number: 0
        };

        //Methods
        vm.findList = findList;
        vm.selectChange = selectChange;
        vm.prevPage = prevPage;
        vm.nextPage = nextPage;
        vm.pagination = pagination;
        vm.onSelectOpen = onSelectOpen;
        vm.onSelectClose = onSelectClose;
        vm.selectedName = selectedName;
        vm.onSelectMultipleOpen = onSelectMultipleOpen;
        vm.onSelectMultipleClose = onSelectMultipleClose;
        vm.refreshMultipleList = refreshMultipleList;
        vm.selectedNames = selectedNames;
        vm.getTooltipNamesList = getTooltipNamesList;

        function findList() {
          return $scope.source(vm.filter.search, vm.filter.page, vm.filter.recordsOnPage).then(function(response) {
            vm.list = response.data;
            vm.filter.number = response.size;
            // if (vm.filter.number === 0 && vm.filter.page > 1) {
            if (vm.list.length === 0 && vm.filter.page > 1) {
              prevPage();
              findList();
            }
          });
        }

        function selectChange(ev) {
          ev.stopPropagation();
        }

        function prevPage() {
          if (vm.filter.page > 1) {
            vm.filter.page--;
            var refresh = ($scope.multiple) ? refreshMultipleList : findList;
            refresh();
          }
        }

        function nextPage() {
          if (vm.filter.page * vm.filter.recordsOnPage < vm.filter.number) {
            vm.filter.page++;
            if ($scope.multiple) {
              refreshMultipleList();
            } else {
              findList();
            }
          }
        }

        function pagination() {
          var str = '';
          str += (vm.filter.page - 1) * vm.filter.recordsOnPage + 1;
          str += '\xa0-\xa0';
          str += (vm.filter.page * vm.filter.recordsOnPage < vm.filter.number) ?
            vm.filter.page * vm.filter.recordsOnPage : vm.filter.number;
          str += '\xa0of\xa0';
          str += vm.filter.number;
          return str;
        }

        function onSelectOpen() {
          vm.tmpList = vm.list;
          vm.tmpId = $scope.ngModel._id;
          vm.list = [];
          $scope.ngModel._id = null;
          findList();
        }

        function onSelectClose() {
          if (!$scope.ngModel._id) {
            $scope.ngModel._id = vm.tmpId;
            vm.list = vm.tmpList;
          }

          vm.list.forEach(function(item) { //do zapisu całego obiektu
            if (item._id === $scope.ngModel._id) {
              $scope.ngModel = item;
            }
          });
        }

        function selectedName() {
          vm.list.forEach(function(item) { //do zapisu nazwy w momencie wypisywania nazwy
            if (item._id === $scope.ngModel._id) {
              $scope.ngModel.name = item.name;
            }
          });
          return $scope.ngModel.name;
        }

        function onSelectMultipleOpen() {
          vm.list = [];
          refreshMultipleList();
        }

        function onSelectMultipleClose() {
          // aktualizacja ngModel'a
          $scope.ngModel = [];
          vm.selectedId.forEach(function(id) {
            var newElement = vm.fullList.find(function(element) {
              return element._id === id;
            });
            if (newElement) {
              $scope.ngModel.push(newElement);
            }
          });
          vm.list = $scope.ngModel.slice();
        }

        function refreshMultipleList() { // budujemy listę wszystkich rekorków, które do tej pory przeglądnęliśmy
          vm.list = [];
          return findList().then(function() {
            vm.list.forEach(function(newElement) { // dodanie nowych elementów do fullList
              var unique = true;
              vm.fullList.forEach(function(element) {
                if (element._id === newElement._id) {
                  unique = false;
                }
              });

              if (unique) {
                vm.fullList.push(newElement);
              }
            });
          });
        }

        function selectedNames() {
          return $scope.ngModel.map(function(element) {
            return element.name;
          }).join(', ');
        }

        function getTooltipNamesList() {
          var counter = 1;
          return $scope.ngModel.map(function(element) {
            return counter++ + ". " + element.name;
          }).join('<br>');
        }
      }]
    };
  }
})();
