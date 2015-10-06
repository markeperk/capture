(function(){
	'use strict';

var app = angular.module('capture')

	.filter('ifEmpty', function() {
    return function(input, defaultValue) {
      if (angular.isUndefined(input) || input === null || input === '' || input === 'NaNundefined' || input === 'NaN.NaNms') {
          return defaultValue;
      }
      return input;
    }
	})
	.filter('capitalize', capitalize);
    function capitalize() {
      return filter;
      function filter(input) {
          if (input !== null) {
              return input.replace(/\w\S*/g, function(txt) {
                  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              });
          }
      }
    }
})(); 
