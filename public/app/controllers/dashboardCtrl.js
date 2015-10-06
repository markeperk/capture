(function(){
	'use strict';

	var app = angular.module('capture');

	app.controller('dashboardCtrl', function( $scope, dashboardService, cleanseHarService) {

		$scope.input_type = 1;
    $scope.showSidebar = false;

		$scope.urlHarRequest = function(url){
			$scope.showContentTypeStats = false;
			$scope.loadingMessage = "Your request is on it's way! Constructing .HAR Data for " + url;
			url = addhttp(url);
			$scope.loading = dashboardService.urlHarRequest(url).then(function(d) {
				$scope.showSidebar = true;
				$scope.loadingMessage = "";	
				$scope.rawData = d;
				$scope.valueAccessor = $scope.accessors.value;
				$scope.contentTypeAccessor = $scope.accessors.packageName;
      	var data = addDataIdentifiers(d);
        $scope.data = cleanseHarService.cleanseHarData(data);
      	$scope.url = removehttp(url) + ".har";
        $scope.urlRequest = '';			
    	}, function(error) {
    		if(error) {
    			$scope.showSidebar = false;
					$scope.data = {children: [{packageName: '', className: '', value: 0}]}
	      	$scope.loadingMessage = "Invalid URL! Please try another URL."
	        $scope.urlRequest = '';	
				} 
    	});
    };

		$scope.uploadedHarData = function(d) {
			if(validateJSON(d)) {
		  	$scope.rawData = JSON.parse(d);
				$scope.showContentTypeStats = false;
				$scope.valueAccessor = $scope.accessors.value;
				$scope.contentTypeAccessor = $scope.accessors.packageName;
				var data = addDataIdentifiers(JSON.parse(d));
				$scope.data = cleanseHarService.cleanseHarData(data);
				$scope.url = removehttp(document.getElementById("uploadHar").value);
				$scope.harJson = '';
	    	$scope.showSidebar = true;
			} else {
				$scope.showSidebar = false;
				$scope.data = {children: [{packageName: '', className: '', value: 0}]}
				$scope.loadingMessage = "Invalid .HAR File! Please try another"
			}
    };
 
	  $scope.pastedHarData = function(data){
	  	if(validateJSON(data)) {
	  		$scope.loadingMessage = "Building .HAR Data from your pasted JSON";
	  		var data = JSON.parse(data)
				if(data || data.log || data.log.pages.length === 0) { 
					$scope.url = "unnamed-data.har"
				} else {
					$scope.url = removehttp(data.log.pages[0].title) + ".har";
				}
		    $scope.loading = dashboardService.pastedHarData(data).then(function(d) {
		    	$scope.rawData = d;
					$scope.valueAccessor = $scope.accessors.value;
					$scope.contentTypeAccessor = $scope.accessors.packageName;
	      	var data = addDataIdentifiers(d);
	        $scope.data = cleanseHarService.cleanseHarData(data); 
	        $scope.harJson = '';
	      	$scope.showSidebar = true;
	    	});
	  	} else {
	  		$scope.showSidebar = false;
	  		$scope.url = "";
	  		$scope.data = {children: [{packageName: '', className: '', value: 0}]};
	  		$scope.loadingMessage = "Invalid .HAR data. Please make sure it's proper .HAR formatted JSON";
	  	}
	  }

	  //selections & filters

		$scope.accessors = {
			className: function(d) { return d.className; },
			className2: function(d) { return d.classNameCt; },
			className3: function(d) { return d.classNameCs; },
			className4: function(d) { return d.classNameMs; },
			value: "time", value2: "rawContentSize", value3: "send", value4: "wait", value5: "receive",
			packageName: "all", packageName2: "document", packageName3: "script", packageName4: "xhr", packageName5: "css", packageName6: "font", packageName7: "image", packageName8: "other"
		};

		$scope.labelAccessor = $scope.accessors.className;
		$scope.valueAccessor = $scope.accessors.value;
		$scope.contentTypeAccessor = $scope.accessors.packageName;
		$scope.labelSelected = 'className';

		$scope.setLabelAccessor = function(labelFn) {
			var lv = labelFn.toString(),
			labelValue = lv.substring(lv.lastIndexOf(".") + 1, lv.lastIndexOf(";")).trim();
			console.log('lv', lv);
			console.log('labelvalue', labelValue)
			$scope.labelSelected = labelValue;
			$scope.labelAccessor = labelFn;
		};

	  $scope.setValueAccessor = function(valueStr) {
			$scope.valueAccessor = valueStr;
			var data = addDataIdentifiers($scope.rawData);
	    $scope.data = cleanseHarService.cleanseHarData(data); 
	  };	  

		$scope.showContentTypeStats = false;
	  $scope.setContentTypeAccessor = function(typeStr) {
	  	if (typeStr !== $scope.accessors.packageName) {
	  		$scope.showContentTypeStats = true;
	  	} else {
	  		$scope.showContentTypeStats = false;
	  	}
			$scope.contentTypeAccessor = typeStr;
			var data = addDataIdentifiers($scope.rawData);
	    $scope.data = cleanseHarService.cleanseHarData(data); 
	  };

	  //functions

	  function addDataIdentifiers(data) {
	  	data.packageName = $scope.contentTypeAccessor;
	  	data.value = $scope.valueAccessor;
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





