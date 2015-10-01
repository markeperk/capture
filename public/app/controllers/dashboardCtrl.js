(function(){
	'use strict';

var app = angular.module('capture');

	app.controller('dashboardCtrl', function($scope, dashboardService){

		$scope.uploadedHarData = function(harData){
				console.log("upload controller", JSON.parse(harData));
				var harObjData = JSON.parse(harData), entries = harObjData.log.entries
				console.log('harobj', harObjData);
				extractLoadTimes(entries);
				if(!$scope.harData) {
        	$scope.harData = harObjData;
				} else {
					$scope.harData = '';
					$scope.harData = harObjData;
				}
    };

	  $scope.pastedHarData = function(harData){
	  	//don't forget to validate json and to clear $scope.harData if there is existing data in value
	  	//add hardata to local storage as well
	    dashboardService.pastedHarData(JSON.parse(harData))
	      .then(function(harData){
	        $scope.harData = harData; 
	        $scope.harJson = '';
	    }); 
	  }

	  
	});
})(); 


function extractLoadTimes(arr) {
	var loadTimes = [];
	console.log('extract', arr);
	var result = arr.map(function(k) {
		loadTimes.push(k.time);
	})
	console.log('loadtimes', loadTimes)
}