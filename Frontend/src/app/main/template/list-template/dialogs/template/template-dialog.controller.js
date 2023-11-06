(function ()
{
    'use strict';

    angular
        .module('app.template')
        .controller('TemplateDialogController', TemplateDialogController);

    /** @ngInject */
    function TemplateDialogController($mdDialog, Template, event, msApi, makeList)
    {
        var vm = this;

        vm.title = 'Edit Template';
        vm.template = angular.copy(Template);
        vm.newTemplate = false;
        vm.flagNewTemplate = false;
        vm.objectTemplate = angular.copy(Template);


        if ( !vm.template )
        {
            //console.log('vm.template pusty, inicjuje...');
            vm.template = {
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
            vm.title = 'New Template';
            //vm.newTemplate = true;
            vm.template.tags = [];
            vm.flagNewTemplate = true;
            vm.newTemplate = {
                selectedPriorityId: '',
                selectedStatusId: '',
                selectedCategoryId: ''
            };
        }

        // Methods
        vm.addNewTemplate = addNewTemplate;
        vm.saveTemplate = saveTemplate;
        vm.deleteTemplate = deleteTemplate;
        vm.newTag = newTag;
        vm.closeDialog = closeDialog;

        
        vm.projectPhrase = '';
        vm.authorPhrase = '';
        vm.newTemplate = {};


        vm.getFeaturesToSelect = function getFeaturesToSelect(){
        };



        vm.inputChange = function inputChange(event){
            event.stopPropagation();
        };
        /**
         * Add new template
         */
        function addNewTemplate() {

        }


        

        // /**
        //  * Save template
        //  */
        function saveTemplate() {

        }

        /**
         * Delete template
         */
        function deleteTemplate() {
            
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