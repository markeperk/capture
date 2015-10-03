(function(){
	'use strict';

var app = angular.module('capture');

	app.service('dashboardService', function($http, $q){

		 this.pastedHarData = function(harData){
		 	var deferred = $q.defer()
      $http({
      	method: 'POST',
      	url: '/api/pasted', 
      	data: harData
      }).then(function(res) {
	      console.log('service pasteddata', res.data)
	      deferred.resolve(res.data);
	    }).catch(function(res) {
	      deferred.reject(res);
	    });
	    return deferred.promise;
		  };

		 this.urlHarRequest = function(url){
		 	var url = String(url)
		 	console.log("service urlRequest", url);
		 	var deferred = $q.defer()
      $http({
      	method: 'POST',
      	url: '/api/urlrequest', 
      	data: { url: url }
      }).then(function(res) {
	      console.log('service urlrequest', res.data)
	      deferred.resolve(res.data);
	    }).catch(function(res) {
	      deferred.reject(res);
	    });
	    return deferred.promise;
		  };
			  
	});
})(); 