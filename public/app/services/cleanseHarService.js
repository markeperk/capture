(function(){
	'use strict';

var app = angular.module('capture');

	app.service('cleanseHarService', function(){

		this.cleanseHarData = function(harData){
     console.log(harData, harData.packageName, harData.value, harData.className);
     return extractData(harData);
    };

    function extractData(harData) {
      var packageName = harData.packageName,
          className = harData.packageName,
          value = harData.value,
          entries = harData.log.entries
      
      var childrenArr = [];
      var global = {
        children: childrenArr,
        childrenStats: childrenStats, //fix this
        currentPackageName: packageName,
        currentClassName: className,
        currentValue: value
      }

      global.name = 
      global.date = 
      global.stats = {
        totalsize:
        totaltime:
        avgsize:
        avgtime:
        totalrequests:
        requestsbyothers:
        nonexpiredheaders:
        totalcookies:
      }

      var childrenStats = new PackageStats(packageName); //place selection stats here
      var result = harData.entries.map(function(d) {
      //packageName: 
        //filter by: all or content type table

    
        //group stats: avg sent, avg wait, avg download
        //group stats: group total load time, group total size
        //group stats: percentage of total time and total size

        //top 5 worst offenders (if 5)
          //type, name, size, total load time, 
          //top 5 group total size, group total load time, sent, wait, download
          //top 5 group avg size, avg load time, sent, wait, download
          //% of total

        var PackageStats = function(packageName) {
          this.totalTime = 
          this.totalSize = 
          this.percGlobalTime = 
          this.percGlobalSize = 
          this.avgTime = 
          this.avgSize = 
          this.avgSent = 
          this.avgWait = 
          this.avgDownload = 
        }



        //packageName :
          //toggle: content name or url name
        
        var packageNameAccessors = {
          all: function(d) { return getType(d.response.content.mimeType); },
          subgroup: function(d) { return getType(d.response.content.mimeType); },
        };  

        //className :
          //toggle: content name or url name
        
        var classNameAccessors = {
          name: function(d) { return d.request.url.toString(); },
          type: function(d) { return formatBytes(k.response.content.size, 2); }
        };   

        //value:
          //toggle: size or load time
             
        var valueAccessors = {
          time: function(d) { return +d.time; },
          size: function(d) { return +d.response.content.size; }
        };



            var childrenObject = {
              packageName: (function(packageName) {
                packageName === "all" ? classNameAccessors.
              })(),
              className: (function(className) {
                className === "type" ? classNameAccessors.type : classNameAccessors.name;
              })(),
              value: (function(value) {
                value === "time" ? classNameAccessors.time : classNameAccessors.size;  
              })()
            }

        childrenArr.push(childrenObject)
      
      return global;
    }

    function extractData(harFormat) {
    //bubble array data(bad), request network phases(rnp), request-initiated requests(rir)
     var bad = [], rnp = [], rir = []
      result = harFormat.map(function(d) {
        //all object data(aod)
        var aod = {}, url = d.request.url.toString();
        if(url.lastIndexOf('/') === url.length - 1) url = url.slice(0, url.length - 1);
        aod.name = (url.substring(url.lastIndexOf('/') + 1, url.length)).trim()
        aod.url = url;
        aod.sdt = moment(d.startedDateTime).format('1111');
        aod.time = moment(d.time).valueOf();
        aod.type = getType(d.response.content.mimeType);
        aod.size = d.response.content.size;
        aod.sizelabel = formatBytes(d.response.content.size, 2);
        aod.blocked = moment(d.timings.blocked).format('SSSS');
        aod.dns = moment(d.timings.dns).format('SSSS');
        aod.connect = moment(d.timings.connect).format('SSSS');
        aod.send = moment(d.timings.wait).format('SSSS');
        aod.receive = moment(d.timings.receive).format('SSSS');
        bad.push({packageName: aod.type, className: aod.name, value: aod.time});
       })
       console.log(bad)
       return {children: bad}
    }

    function getType(type, url) {
      if (!type || type === undefined) {
        return 'other';
      }
      type = type.toLowerCase();
      if (type.substr(0, 8) === 'text/css') {
        return 'css';
      }
      if (/javascript/.test(type)) {
        return 'script';
      }
      if (/\/json/.test(type)) {
        return 'xhr';
      }
      if (type.substr(0, 5) === 'font/' ||
          /(\/|-)font-/.test(type) || /\/font/.test(type) ||
          /\.((eot)|(otf)|(ttf)|(woff))($|\?)/i.test(url)) {
        return 'font';
      }
      if (type.substr(0, 6) === 'image/' ||
          /\.((gif)|(png)|(jpe)|(jpeg)|(jpg)|(tiff))($|\?)/i.test(url)) {
        return 'image';
      }
      if (type.substr(0, 6) === 'audio/' || type.substr(0, 6) === 'video/' ||
          /\.((flac)|(ogg)|(opus)|(mp3)|(wav)|(weba))($|\?)/i.test(url) ||
          /\.((mp4)|(webm))($|\?)/i.test(url)) {
        return 'other';
      }
      if (type.substr(0, 9) === 'text/html' ||
          type.substr(0, 10) === 'text/plain') {
        return 'document';
      }
      return 'other';
    }

    function formatBytes(bytes,decimals) {
      if(bytes == 0) return '0 Byte';
      var k = 1000,
          dm = decimals + 1 || 3,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
    }

    // function getEntryName(string) {
    //   if(string.lastIndexOf('/') === string.length - 1) {
    //     var nUrl = string.slice(0, string.length - 1)
    //     return (nUrl.substring(nUrl.lastIndexOf('/') + 1, nUrl.length)).trim()
    //   } else {
    //     return (string.substring(string.lastIndexOf('/') + 1, string.length)).trim()
    //   }
    // }
  });
})(); 


//format

      //url global name
      //url global date

      //global stats:
        //total page load size / avg load size
        //total page load time / avg load time
        //number of requests
        //number of headers that don't expire
        //number of cookies
        //number of requests initiated by other requests

      //packageName: 
        //filter by: all or content type table

        //group stats: avg sent, avg wait, avg download
        //group stats: group total load time, group total size
        //group stats: percentage of total time and total size

        //value:
          //toggle: size or load time

        //className :
          //toggle: content name or url name

        //top 5 worst offenders (if 5)
          //type, name, size, total load time, 
          //top 5 group total size, group total load time, sent, wait, download
          //top 5 group avg size, avg load time, sent, wait, download
          //% of total


