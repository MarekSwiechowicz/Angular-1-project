(function ()
{
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($location,AuthService,$state)
    {
        var vm = this;

        // Data

        // Methods
        vm.authService = AuthService;
        vm.goToTemplates = goToTemplates;
        vm.goToTournaments = goToTournaments;
        vm.goToRegister = goToRegister;

        function goToRegister() {
            $state.go('app.auth_register');
        }

        function goToTemplates() {
            $state.go('app.template_list');
        }

        function goToTournaments() {
            $state.go('app.tournament_list');
        }


        var slideIndex = 0;
        carousel();

        function carousel() {
            // var i;
            // var x = document.getElementsByClassName("mySlides");
            // for (i = 0; i < x.length; i++) {
            //   x[i].style.display = "none"; 
            // }
            // slideIndex++;
            // if (slideIndex > x.length) {slideIndex = 1} 
            // x[slideIndex-1].style.display = "block"; 
            // setTimeout(carousel, 2000); // Change image every 2 seconds
        }


    }

})();
