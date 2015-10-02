(function(){
	'use strict';

var app = angular.module('capture');

	app.service('dashboardService', function($http, $q){

		 this.pastedHarData = function(harData){
		 	console.log("harData", harData);
		 	var deferred = $q.defer()
      $http({
      	method: 'POST',
      	url: '/api/pasted', 
      	data: harData
      }).then(function(res) {
	      console.log('service returned', res.data)
	      deferred.resolve(res.data);
	    }).catch(function(res) {
	      deferred.reject(res);
	    });
	    return deferred.promise;
		  };
			  
	});
})(); 