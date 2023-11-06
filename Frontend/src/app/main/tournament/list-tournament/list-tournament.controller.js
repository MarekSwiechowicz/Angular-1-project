(function() {
  'use strict';

  angular
    .module('app.tournament.list')
    .controller('TournamentListController', TournamentListController);

  /** @ngInject */
  function TournamentListController($document, $mdDialog, msApi, $scope, $location, tournamentService, AuthService, utilsService) {

    var vm = this;


    vm.activated = false;
    vm.activated2 = false;
    vm.myTournamentsFlag = false;

    vm.showAllTournament = true;

    vm.tournamentOrder = '';
    vm.tournamentOrderDescending = false;


    // Methods
    vm.preventDefault = preventDefault;
    vm.newTournamentDialog = newTournamentDialog;
    vm.showTournament = showTournament;
    vm.changeList = changeList;
    vm.nextPage = nextPage;
    vm.previousPage = previousPage;
    vm.isLogged = AuthService.isLogged;
    vm.showToast = utilsService.showToast;



    function showTournament(event, id) {
      event.stopPropagation();
      // console.log('Pokazuje tournament');
      // console.log(id);
      $location.path('/edit-tournament/' + id);
    }

    function makeList() {
      tournamentService.findTournaments(vm.tournamentList.page * vm.tournamentList.perPage, vm.tournamentList.perPage, vm.tournamentList.query, !vm.myTournamentsFlag || !vm.isLogged(), vm.isLogged()).then(function(response) {
        vm.tournaments = response.data.tournaments;
        vm.tournamentList.amount = response.data.tournamentCount;
      }); //owner from quantity query pub priv
    }

    function changeList() {
      vm.tournamentList.page = 0;
      makeList();
    }


    function previousPage() {
      if (vm.tournamentList.page > 0) {
        vm.tournamentList.page--;
        makeList();
      }
    }

    function nextPage() {
      if ((vm.tournamentList.page + 1) * vm.tournamentList.perPage < vm.tournamentList.amount) {
        vm.tournamentList.page++;
        makeList();
      }
    }



    init();

    //////////


    $scope.changeLimitShowedItems = function changeLimitShowedItems(limit) {
      makeList();
    };



    /**
     * Initialize the controller
     */
    function init() {
      vm.showedLabels = [{
        name: 'Tournament name',
        value: true,
        modify: false
      }, {
        name: 'Number of players',
        value: true,
        modify: true
      }, {
        name: 'Role',
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
        name: 'Template name',
        value: true,
        modify: true
      }, {
        name: 'Description',
        value: true,
        modify: true
      // }, {
      //   name: 'Manage',
      //   value: true,
      //   modify: false
      }];

      vm.tournamentList = {
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

    function newTournamentDialog() {
      if (vm.isLogged()) {
        $mdDialog.show({
          controller: 'AdminPanelController',
          controllerAs: 'vm',
          templateUrl: 'app/main/tournament/edit-tournament/dialogs/admin-panel.html',
          clickOutsideToClose: false,
          locals: {
            tournament: null,
            template: null
          }
        });
      } else {
        vm.showToast('You have to login first');
      }
    }

    vm.inputChange = function inputChange(event) {
      event.stopPropagation();
    };

  }
})();
