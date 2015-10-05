(function(){
	'use strict';

var app = angular.module('capture');

	app.controller('dashboardCtrl', function($scope, dashboardService, cleanseHarService) {

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

    $scope.showSidebar = false;

		$scope.urlHarRequest = function(url){
			$scope.showSidebar = true;
			$scope.url = "Building .har for " + url;
			url = addhttp(url);
			$scope.loadHar = !$scope.loadHar;
			dashboardService.urlHarRequest(url)
	      .then(function(data) {
	      	data = addDataIdentifiers(data)
	      	cleanseHarService.cleanseHarData(data)
	      		.then(function(data) {
			      	$scope.url = removehttp(url) + ".har";
			      	$scope.loadHar = !$scope.loadHar;
			      	$scope.jsonError = '';
			        $scope.data = data; 
			        $scope.urlRequest = '';	
	      		});
	    	});
    };

		$scope.uploadedHarData = function(data) {
			$scope.harJson = '';
			data = addDataIdentifiers(JSON.parse(data));
	    cleanseHarService.cleanseHarData(data).then(function(data) {
	    	$scope.showSidebar = true;
				$scope.url = removehttp(document.getElementById("uploadHar").value);
				$scope.data = data;
			});
    };
 
	  $scope.pastedHarData = function(data){
	  	if(validateJSON(data)) {
	  		$scope.loadHar = !$scope.loadHar;
	  		var data = JSON.parse(data)
				if(data.log.pages.length === 0) { 
					$scope.url = "unnamed-data.har"
				} else {
					$scope.url = removehttp(data.log.pages[0].title) + ".har";
				}
		    dashboardService.pastedHarData(data)
		      .then(function(data) {
		      	$scope.showSidebar = true;
		      	data = addDataIdentifiers(data)
		      	cleanseHarService.cleanseHarData(data)
		      		.then(function(data) {
				      	$scope.loadHar = !$scope.loadHar;
				        $scope.data = data; 
				        $scope.harJson = '';
				      });
		    	});
	  	} else {
	  		$scope.url = "";
	  		$scope.data = "";
	  		$scope.url = "Invalid .har data";
	  	}
	  }

	  //selections
		$scope.gPercent = false;
	  $scope.packageName = function(packageName) {
	  	//if someone selects something other than all.. then turn on addtional field
	    data.requestedPackageName === "all" ? $scope.gPercent = true : $scope.gPercent = false;


	  }
	  $scope.className = function(className) {

	  }
	  $scope.value = function(value) {

	  }



	  //functions

	  function addDataIdentifiers(data) {
	  	data.packageName = "all";
	  	data.value = "time";
	  	data.className = "name";
	  	return data;
	  }
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
			if (url.lastIndexOf('/') === url.length - 1) url = url.slice(0, url.length - 1);
		 	if (url.search("https://www.") !== -1) url = url.substring(12, url.length);
		 	if (url.search("http://www.") !== -1) url = url.substring(11, url.length);
		 	if (url.search("https://") !== -1) url = url.substring(8, url.length);
		 	if (url.search("http://") !== -1) url = url.substring(7, url.length);
		 	if (url.lastIndexOf(".har") !== -1) url = url.substring(url.indexOf("www.") + 4, url.length);
		 	if (url.indexOf("fakepath") !== -1) url = url.substring(url.indexOf("fakepath") + 9, url.length);
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