(function ()
{
    'use strict';

	angular
		.module('app.template')
		.directive('noSpace' ,checkSpace);

		function checkSpace()
		{
			return {
	            restrict   : 'A',
	            require: 'ngModel',
	            link       : function (scope, iElement, attrs, ngModel)
	            {

	                //console.log(attrs, ngModel);
	                scope.$watch(attrs.ngModel, function(value){
	                    ngModel.$setValidity('noSpace', true);

	                    if (value)
	                    {
	                        var pattern = new RegExp(' ');
	                        if (pattern.test(value))
	                        {
	                            ngModel.$setValidity('noSpace', false); 
	                        }
	                    }
	                });
	            }
        	};
		}
})();