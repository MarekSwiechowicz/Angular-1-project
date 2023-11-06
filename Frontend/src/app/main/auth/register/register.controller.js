(function ()
{
    'use strict';

    angular
        .module('app.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(AuthService, $mdDialog, $timeout, $state, utilsService)
    {
        // Data
        var vm=this;
        // Methods
        vm.register=register;
        //////////
        function register(){
          AuthService.register(vm.form.username, vm.form.email, vm.form.password).then(function(response){
            if (response.success===false) {
                utilsService.showToast('User already exists!')
                $timeout(function(){$mdDialog.hide()}, 3000);
            }else{
              utilsService.showToast('Successfully created user!');
              $timeout(function(){
                $state.go('app.home');
              }, 1000);
            }
          });
        }
    }
})();
