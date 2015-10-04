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
      	console.log('service res', res.data[0])
      	var address = res.data[0].address, title = res.data[0].title, startTime = res.data[0].startTime, endTime = res.data[0].endTime, resources = res.data[0].resources;
      	var harData = createHAR(address, title, startTime, endTime, resources);
	      console.log('service urlrequest', harData)
	      deferred.resolve(harData);
	    }).catch(function(res) {
	      deferred.reject(res);
	    });
	    return deferred.promise;
		  };

	function createHAR(address, title, startTime, endTime, resources) {
    var entries = [];
    resources = resources.filter(function(j) {return j}).map(function(k) {
  		 var request = k.request,
		       startReply = k.startReply,
		       endReply = k.endReply;
      if (!request || !startReply || !endReply) {
          return;
      }
      // Exclude Data URI from HAR file because
      // they aren't included in specification
      if (request.url.match(/(^data:image\/.*)/i)) {
          return;
			}
      entries.push({
        // startedDateTime: request.time.toISOString(),
        startedDateTime: moment(request.time).format("DD/MM/YYYY HH:mm:ss:SSSS"),
        time: moment.utc(moment(endReply.time,"DD/MM/YYYY HH:mm:ss:SSSS").diff(moment(request.time,"DD/MM/YYYY HH:mm:ss:SSSS"))).valueOf(),
        request: {
          method: request.method,
          url: request.url,
          httpVersion: "HTTP/1.1",
          cookies: [],
          headers: request.headers,
          queryString: [],
          headersSize: -1,
          bodySize: -1
        },
        response: {
          status: endReply.status,
          statusText: endReply.statusText,
          httpVersion: "HTTP/1.1",
          cookies: [],
          headers: endReply.headers,
          redirectURL: "",
          headersSize: -1,
          bodySize: +startReply.bodySize,
          content: {
            size: +startReply.bodySize,
            mimeType: endReply.contentType
          }
        },
        cache: {},
        timings: {
          blocked: 0,
          dns: -1,
          connect: -1,
          send: 0,
          wait: moment.utc(moment(startReply.time,"DD/MM/YYYY HH:mm:ss:SSSS").diff(moment(request.time,"DD/MM/YYYY HH:mm:ss:SSSS"))).valueOf(),
          receive: moment.utc(moment(endReply.time,"DD/MM/YYYY HH:mm:ss:SSSS").diff(moment(startReply.time,"DD/MM/YYYY HH:mm:ss:SSSS"))).valueOf(),
          ssl: -1
        },
        pageref: address
      });
    });
    return {
      log: {
        version: '1.2',
        creator: {
          name: "PhantomJS",
          version: "phantom module"
        },
        pages: [{
          // startedDateTime: startTime.toISOString(),
          startedDateTime: moment(startTime).format("DD/MM/YYYY HH:mm:ss:SSSS"),
          id: address,
          title: title,
          pageTimings: {
            onLoad: moment.utc(moment(endTime,"DD/MM/YYYY HH:mm:ss:SSSS").diff(moment(startTime,"DD/MM/YYYY HH:mm:ss:SSSS"))).valueOf()
          }
        }],
        entries: entries
      }
    };
	} //end of function createHAR


	});
})(); 



