(function() {
  'use strict';

  angular
    .module('app.custom-directives')
    .directive('autoComplete', autoCompleteDirective);

  /** @ngInject */
  function autoCompleteDirective($timeout) {
    return function(scope, elem, iAttrs) {
      elem.autocomplete({
        source: scope[iAttrs.uiItems]
      //   select: function() {
      //     $timeout(function() {
      //       elem.trigger('input');
      //     });
      //   }
      });
    };
  }
})();