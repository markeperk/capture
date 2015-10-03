(function(){
	'use strict';

var app = angular.module('capture');

	app.directive('autoFocus', function($parse){
		return {
				restrict: 'AE',
				link: function(scope, element, attrs) {
					jQuery(function($){
					  $('#textfocus')
					    .focus(function(){ this.rows=5 })
					    .blur( function(){ this.rows=1 });
					});
				}
			};
	});
})(); 














