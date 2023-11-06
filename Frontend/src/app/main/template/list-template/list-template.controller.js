(function() {
  'use strict';

  angular
    .module('app.template.list')
    .controller('TemplateListController', TemplateListController);

  /** @ngInject */
  function TemplateListController($document, $mdDialog, msApi, $scope, $location, templateService, utilsService, userService, AuthService) {

    var vm = this;

    vm.activated = false;
    vm.activated2 = false;
    vm.myTemplatesFlag = false;
    vm.isLogged = AuthService.isLogged();

    vm.msScrollOptions = {
      suppressScrollX: true
    };

    init();

    // Methods
    vm.preventDefault = preventDefault;
    vm.openTemplateDialog = openTemplateDialog;
    vm.changeLabels = changeLabels;
    vm.runTemplate = runTemplate;
    vm.editTemplate = editTemplate;
    vm.delTemplate = delTemplate;
    vm.showTemplate = showTemplate;
    vm.addToMyTemplates = addToMyTemplates;
    vm.nextPage = nextPage;
    vm.previousPage = previousPage;
    vm.changeList = changeList;
    vm.showToast = utilsService.showToast;
    vm.ifOwner = userService.isOwner;

    function addToMyTemplates(event, id) {
      event.stopPropagation();
      if (vm.isLogged) {
        templateService.addToMyTemplates(id).then(function(response) {
          if (response.success) {
            vm.showToast('Template has been added to yours');
            makeList();
          } else {
            vm.showToast(response.message);
          }
        });
      } else {
        vm.showToast('You have to login first');
      }
    }

    function runTemplate(event, template) {
      event.stopPropagation();
      if (vm.isLogged) {
        if (template.valid) {
          $mdDialog.show({
            controller: 'AdminPanelController',
            controllerAs: 'vm',
            templateUrl: 'app/main/tournament/edit-tournament/dialogs/admin-panel.html',
            clickOutsideToClose: false,
            locals: {
              tournament: null,
              template: template
            }
          });
        } else {
          vm.showToast('Template is not valid. You need to edit template first');
        }
      } else {
        vm.showToast('You have to login first');
      }
    }

    function editTemplate(event, id) {
      event.stopPropagation();
      $location.path('/edit-template/' + id);
    }

    function delTemplate(event, id) {
      event.stopPropagation();
      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The template will be deleted.')
        .ariaLabel('Delete template')
        .ok('Delete')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        templateService.deleteTemplate(id).then(function(response) {
          if (response.success) {
            vm.showToast('Template has been deleted');
            makeList();
          } else {
            vm.showToast(response.message);
          }
        });
      });
    }

    function showTemplate(event, id) {
      event.stopPropagation();
      $location.path('/show-template/' + id);
    }

    function makeList() {
      templateService.findTemplates(vm.templateList.page * vm.templateList.perPage, vm.templateList.perPage, vm.templateList.query, !vm.myTemplatesFlag, true).then(function(response) {
        vm.templates = response.data.templates;

        // vm.allRecords=response.data.templateCount-1;
        vm.templateList.amount = response.data.templateCount;
      }); //owner from quantity query pub priv
    }

    function changeLabels() {

    }

    function changeList() {
      vm.templateList.page = 0;
      makeList();
    }


    function previousPage() {
      if (vm.templateList.page > 0) {
        vm.templateList.page--;
        makeList();
      }
    }

    function nextPage() {
      if ((vm.templateList.page + 1) * vm.templateList.perPage < vm.templateList.amount) {
        vm.templateList.page++;
        makeList();
      }
    }


    /**
     * Initialize the controller
     */
    function init() {
      vm.showedLabels = [{
        name: 'Name',
        value: true,
        modify: false
      }, {
        name: 'Number of players',
        value: true,
        modify: true
      }, {
        name: 'Mine',
        value: true,
        modify: true
      }, {
        name: 'Public',
        value: true,
        modify: true
      }, {
        name: 'Owner',
        value: true,
        modify: true
      }, {
        name: 'RUN',
        value: true,
        modify: false
      }, {
        name: 'EDIT/ADD',
        value: true,
        modify: false
      }, {
        name: 'DEL',
        value: true,
        modify: false
      }];

      vm.templateList = {
        query: '',
        page: 0,
        perPage: 10,
        amount: 0
      };
      makeList();
    }

    function preventDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function openTemplateDialog(ev, template) {
      if (vm.isLogged) {
        $location.path('/edit-template/');
      } else {
        vm.showToast('You have to login first');
      }
    }

    vm.inputChange = function inputChange(event) {
      event.stopPropagation();
    };


  }
})();
