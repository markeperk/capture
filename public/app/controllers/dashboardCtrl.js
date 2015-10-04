(function(){
	'use strict';

var app = angular.module('capture');

	app.controller('dashboardCtrl', function($scope, dashboardService){
		
		var harInputOption = 1;
	  $scope.harInputOptions = function() {
      if (harInputOption === 1) {
        $scope.menuInputUrl = true; 
        $scope.menuInputUpload = false; 
        $scope.menuInputCopypaste = false;
        return harInputOption = 2;
      };
      if (harInputOption === 2) {
       	$scope.menuInputUrl = false; 
        $scope.menuInputUpload = true; 
        $scope.menuInputCopypaste = false;
        return harInputOption = 3;
      };
      if (harInputOption === 3) {
       	$scope.menuInputUrl = false; 
        $scope.menuInputUpload = false; 
        $scope.menuInputCopypaste = true;
        return harInputOption = 1;
      };
    }
    $scope.harInputOptions();

		$scope.urlHarRequest = function(url){
				var url = addhttp(url);
				$scope.url = "Retrieving Data for " + url;
				$scope.loadHar = !$scope.loadHar;
				dashboardService.urlHarRequest(url)
		      .then(function(data) {
		      	$scope.url = removehttp(url) + ".har";
		      	$scope.loadHar = !$scope.loadHar;
		      	$scope.jsonError = '';
		        $scope.data = data; 
		        $scope.urlRequest = '';
		    });
    };

		$scope.uploadedHarData = function(data){
				$scope.jsonError = '';
				$scope.harJson = '';
				$scope.data = JSON.parse(data);
    };
 
	  $scope.pastedHarData = function(data){
	  	if(validateJSON(data)) {
		    dashboardService.pastedHarData(JSON.parse(data))
		      .then(function(data) {
		      	$scope.jsonError = '';
		        $scope.data = data; 
		        $scope.harJson = '';
		    });
	  	} else {
	  		$scope.jsonError = "Please use a valid .har file";
	  	}
	  }
	  //functions
		function validateJSON(harJson) {
	    try {
        var har = JSON.parse(harJson);
        if (har && typeof har === "object" && har !== null) 
        	return har;
	    }
	    catch (e) { }
	    	return false;
		};
		function addhttp(url) {
			var url = url.trim();
		 	if (!url.match(/^[a-zA-Z]+:\/\//) && url.search("www.") === -1) url = 'http://www.' + url;
		 	if (!url.match(/^[a-zA-Z]+:\/\//)) url = 'http://' + url;
		 	return url;
		};
		function removehttp(url) {
			var url = url.trim();
		 	if (url.search("https://www.") !== -1) url = url.substring(12, url.length);
		 	if (url.search("http://www.") !== -1) url = url.substring(11, url.length);
		 	if (url.search("https://") !== -1) url = url.substring(8, url.length);
		 	if (url.search("http://") !== -1) url = url.substring(7, url.length);
		 	return url;
		};
	});
})(); 












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