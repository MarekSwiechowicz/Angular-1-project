(function() {
  'use strict';

  angular
    .module('app.tournament.edit')
    .controller('AdminPanelController', AdminPanelController);

  function AdminPanelController($mdDialog, tournament, template, $location, tournamentService, templateService, userService, utilsService) {
    var vm = this;

    vm.exists = (tournament) ? true : false;

    if (vm.exists) {
      vm.tournament = angular.copy(tournament);
      vm.tournament.template.valid = true;
      if (vm.tournament.connections === undefined) { //kompatybilnosc ze starymi templejtami
        vm.tournament.connections = true;
      }
    } else {
      vm.tournament = {
        _id: null, // będzie uzupełniony tylko, gdy (vm.exists)
        name: '',
        private: true,
        template: (template) ? {
          _id: template._id,
          name: template.name,
          valid: template.valid
        } : {
          _id: null,
          name: null,
        },
        moderators: [], // userzy na stronie
        description: '',
        connections: true
      };

    }


    vm.run = run;
    vm.save = save;
    vm.remove = remove;
    vm.findTemplates = findTemplates;
    vm.findUsers = findUsers;
    vm.showToast = utilsService.showToast;
    vm.closeDialog = closeDialog;

    function closeDialog() {
      $mdDialog.hide();
    }

    function run() {
      if (validate()) {
        tournamentService.createTournament(vm.tournament).then(function(response) {
          if (response.success) {
            vm.showToast('Your tournament has been created!');
            vm.tournament._id = response.data._id;
            $location.path('/edit-tournament/' + vm.tournament._id);
            $mdDialog.hide();
          } else {
            vm.showToast(response.message);
          }
        });
      }
    }

    function save() {
      if (validate()) {
        tournamentService.updateTournamentStructure(vm.tournament._id, vm.tournament).then(function(response) {
          if (response.success) {
            Object.assign(tournament, vm.tournament);
            vm.showToast('Tournament has been saved!');
            $mdDialog.hide();
          } else {
            vm.showToast(response.message);
          }
        });
      }
    }

    function remove() {
      var confirm = $mdDialog.confirm()
        .title('Are you really sure?')
        .ariaLabel('Delete tournament')
        .ok('Delete')
        .cancel('Cancel');
      var ask = $mdDialog.confirm()
        .title('Are you sure?')
        .content('The tournament will be deleted. This cannot be undone.')
        .ariaLabel('Delete tournament')
        .ok('Delete')
        .cancel('Cancel');
      $mdDialog.show(ask).then(function() {
        $mdDialog.show(confirm).then(function() {
          tournamentService.deleteTournament(vm.tournament._id).then(function(response) {
            if (response.success) {
              vm.showToast('The tournament has been deleted');
              $location.path('/list-tournament');
            } else {
              vm.showToast(response.message);
            }
          });
        });
      });
    }

    function validate() {
      if (!vm.tournament.name) {
        vm.showToast('You need to enter the name of tournament first');
        return false;
      } else if (!vm.tournament.template._id) {
        vm.showToast('You need to select the template of tournament first');
        return false;
      } else if (!vm.tournament.template.valid) {
        vm.showToast('You need to select a valid template of tournament');
        return false;
      } else {
        return true;
      }
    }

    function findTemplates(word, pageNumber, pageSize) {
      var from = (pageNumber - 1) * pageSize;
      return templateService.findTemplates(from, pageSize, word, true, true).then(function(response) {
        if (response.data) {
          return {
            data: response.data.templates.map(function(item) {
              if (!item.valid) {
                item.name += ' (not valid)';
              }
              return item;
            }),
            size: response.data.templateCount
          };
        } else {
          return {
            data: [],
            size: 0
          };
        }
      });
    }

    function findUsers(word, pageNumber, pageSize) {
      var from = (pageNumber - 1) * pageSize;
      return userService.findUsers(from, pageSize, word).then(function(response) {
        if (response.data) {
          return {
            data: response.data.users,
            size: response.data.amount
          };
        } else {
          return {
            data: [],
            size: 0
          };
        }
      });
    }
  }
})();
