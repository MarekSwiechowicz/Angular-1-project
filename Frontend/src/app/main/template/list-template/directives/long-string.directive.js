(function ()
{
    'use strict';

	angular
		.module('app.template')
		.directive('longString' ,check);

		function check()
		{
			return {
	            restrict   : 'A',
	            require: 'ngModel',
	            link       : function (scope, iElement, attrs, ngModel)
	            {

	                //console.log(attrs, ngModel);
	                scope.$watch(attrs.ngModel, function(value){
	                    ngModel.$setValidity('longString', true);

	                    if(value) {
	                    	var retVal = /^(.{1,400})$/.test(value);
		                    if (!retVal){
		                        ngModel.$setValidity('longString', false); 
		                    }
	                    }
				        
	                });
	            }
        	};
		}
})();