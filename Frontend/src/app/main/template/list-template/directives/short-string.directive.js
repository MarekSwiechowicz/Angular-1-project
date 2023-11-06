(function ()
{
    'use strict';

	angular
		.module('app.template')
		.directive('shortString' ,check);

		function check()
		{
			return {
	            restrict   : 'A',
	            require: 'ngModel',
	            link       : function (scope, iElement, attrs, ngModel)
	            {

	                //console.log(attrs, ngModel);
	                scope.$watch(attrs.ngModel, function(value){
	                    ngModel.$setValidity('shortString', true);

	                    if(value) {
	                    	var retVal = /^(.{1,50})$/.test(value);
		                    if (!retVal){
		                        ngModel.$setValidity('shortString', false); 
		                    }
	                    }
				        
	                });
	            }
        	};
		}
})();