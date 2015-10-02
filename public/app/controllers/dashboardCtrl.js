(function(){
	'use strict';

var app = angular.module('capture');

	app.controller('dashboardCtrl', function($scope, dashboardService){
		
		$scope.uploadedHarData = function(harData){
				console.log("upload controller", JSON.parse(harData));
				var harObjData = JSON.parse(harData), entries = harObjData.log.entries
				console.log('harobj', harObjData);

				extractBubbleData(entries);
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


function extractBubbleData(arr) {
	var bubbleArrData = [],
			result = arr.map(function(k) {
				var bubbleObjData = {}, name = k.request.url.toString();
				if(name.lastIndexOf('/') === name.length - 1) {
					var nUrl = name.slice(0, name.length - 1)
					bubbleObjData.name = (nUrl.substring(nUrl.lastIndexOf('/') + 1, nUrl.length)).trim()
				} else {
					bubbleObjData.name = (name.substring(name.lastIndexOf('/') + 1, name.length)).trim()
				}
				bubbleObjData.time = moment(k.time).format('SS');
				bubbleObjData.type = getType(k.response.content.mimeType);
				bubbleObjData.size = formatBytes(k.response.content.size, 2);
				bubbleObjData.url = k.request.url.toString();
				bubbleArrData.push(bubbleObjData);
			})
	console.log(bubbleArrData)
}

function getType(ct, url) {
    if (ct === undefined) {
      return 'other';
    }
    ct = ct.toLowerCase();
    if (ct.substr(0, 8) === 'text/css') {
      return 'css';
    }
    if (/javascript/.test(ct)) {
      return 'script';
    }
    if (/\/json/.test(ct)) {
      return 'xhr';
    }
    if (ct.substr(0, 5) === 'font/' ||
        /(\/|-)font-/.test(ct) || /\/font/.test(ct) ||
        /\.((eot)|(otf)|(ttf)|(woff))($|\?)/i.test(url)) {
      return 'font';
    }
    if (ct.substr(0, 6) === 'image/' ||
        /\.((gif)|(png)|(jpe)|(jpeg)|(jpg)|(tiff))($|\?)/i.test(url)) {
      return 'img';
    }
    if (ct.substr(0, 6) === 'audio/' || ct.substr(0, 6) === 'video/' ||
        /\.((flac)|(ogg)|(opus)|(mp3)|(wav)|(weba))($|\?)/i.test(url) ||
        /\.((mp4)|(webm))($|\?)/i.test(url)) {
      return 'other';
    }
    if (ct.substr(0, 9) === 'text/html' ||
        ct.substr(0, 10) === 'text/plain') {
      return 'document';
    }
    return 'other';
  }

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
}