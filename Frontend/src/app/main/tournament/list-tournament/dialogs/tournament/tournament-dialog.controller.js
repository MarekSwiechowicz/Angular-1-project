(function ()
{
    'use strict';

    angular
        .module('app.tournament')
        .controller('TournamentDialogController', TournamentDialogController);

    /** @ngInject */
    function TournamentDialogController($mdDialog, Tournament, event, msApi, makeList)
    {
        var vm = this;

        vm.title = 'Edit Tournament';
        vm.tournament = angular.copy(Tournament);
        vm.newTournament = false;
        vm.flagNewTournament = false;
        vm.objectTournament = angular.copy(Tournament);


        if ( !vm.tournament )
        {
            //console.log('vm.tournament pusty, inicjuje...');
            vm.tournament = {
                'id'                : '',
                'title'             : '',
                'notes'             : '',
                'startDate'         : new Date(),
                'startDateTimeStamp': new Date().getTime(),
                'dueDate'           : '',
                'dueDateTimeStamp'  : '',
                'completed'         : false,
                'starred'           : false,
                'important'         : false,
                'deleted'           : false,
                'tags'              : []
            };
            vm.title = 'New Tournament';
            //vm.newTournament = true;
            vm.tournament.tags = [];
            vm.flagNewTournament = true;
            vm.newTournament = {
                selectedPriorityId: '',
                selectedStatusId: '',
                selectedCategoryId: ''
            };
        }

        // Methods
        vm.addNewTournament = addNewTournament;
        vm.saveTournament = saveTournament;
        vm.deleteTournament = deleteTournament;
        vm.newTag = newTag;
        vm.closeDialog = closeDialog;


        vm.projectPhrase = '';
        vm.authorPhrase = '';
        vm.newTournament = {};


        vm.getFeaturesToSelect = function getFeaturesToSelect(){
        };



        vm.inputChange = function inputChange(event){
            event.stopPropagation();
        };
        /**
         * Add new tournament
         */
        function addNewTournament() {

        }




        // /**
        //  * Save tournament
        //  */
        function saveTournament() {

        }

        /**
         * Delete tournament
         */
        function deleteTournament() {

        }


        /**
         * New tag
         *
         * @param chip
         * @returns {{label: *, color: string}}
         */
        function newTag(chip)
        {
            var tagColors = ['#388E3C', '#F44336', '#FF9800', '#0091EA', '#9C27B0'];

            return {
                name : chip,
                label: chip,
                color: tagColors[Math.floor(Math.random() * (tagColors.length))]
            };
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }
    }
})();
