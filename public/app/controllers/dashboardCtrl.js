(function(){
	'use strict';

var app = angular.module('capture');

	app.controller('dashboardCtrl', function($scope, dashboardService){
		

		//add hardata to local storage?
		// function notifyDataChange() {
		// 	return $scope.$broadcast('capture.dashboard.data.new');
		// }

		$scope.uploadedHarData = function(data){
				console.log("upload controller", JSON.parse(data));
				$scope.data = '';
				$scope.jsonError = '';
				$scope.harJson = '';
				$scope.data = JSON.parse(data);
				// notifyDataChange();
    };
 
	  $scope.pastedHarData = function(data){
	  	if(validateJSON(data)) {
		    dashboardService.pastedHarData(JSON.parse(data))
		      .then(function(data) {
		      	$scope.jsonError = '';
		        $scope.data = data; 
		        $scope.harJson = '';
		        // notifyDataChange();
		    });
	  	} else {
	  		$scope.jsonError = "Please use a valid .har file";
	  	}
	  }  
	});
})(); 








function validateJSON(harJSON) {
    try {
        var o = JSON.parse(harJSON);
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }
    	return false;
};



// function extractBubbleData(arr) {
// 	var bubbleArrData = [],
// 			result = arr.map(function(k) {
// 				var bubbleObjData = {}, name = k.request.url.toString();
// 				if(name.lastIndexOf('/') === name.length - 1) {
// 					var nUrl = name.slice(0, name.length - 1)
// 					bubbleObjData.name = (nUrl.substring(nUrl.lastIndexOf('/') + 1, nUrl.length)).trim()
// 				} else {
// 					bubbleObjData.name = (name.substring(name.lastIndexOf('/') + 1, name.length)).trim()
// 				}
// 				bubbleObjData.time = moment(k.time).format('SSSS');
// 				bubbleObjData.type = getType(k.response.content.mimeType);
// 				bubbleObjData.size = k.response.content.size;
// 				bubbleObjData.sizelabel = formatBytes(k.response.content.size, 2);
// 				bubbleObjData.url = k.request.url.toString();
// 				bubbleArrData.push(bubbleObjData);
// 			})
// 	console.log(bubbleArrData)
// }