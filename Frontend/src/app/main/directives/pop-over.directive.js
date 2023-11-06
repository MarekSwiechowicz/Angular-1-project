(function() {
  'use strict';

  angular
	.module("app.custom-directives")
	.directive('popOver', function($http) {
    return {
      restrict: 'C',
      link: function(scope, element, attr) {

        element.bind('mouseover', function(e) {

          if (element[0].offsetWidth < element[0].scrollWidth) {
            element.attr('tooltip-enable', true);
          } else {
            element.attr('tooltip-enable', false);
          }

        });
      }
    }
  });
})();
