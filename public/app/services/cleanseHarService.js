(function(){
	'use strict';

  var app = angular.module('capture');

  app.service('cleanseHarService', function($q){

  	this.cleanseHarData = function(harData){
      return extractData(harData);
    };

    function extractData(harData) {
      var packageName = harData.packageName,
          className = harData.className,
          value = harData.value,
          log = harData.log || {},
          entries = log.entries,
          name = (log.pages[0] || {}).title || '',
          date = (log.pages[0] || {}).startedDateTime || '',
          id = (log.pages[0] || {}).id || '',
          domContentLoaded = ((log.pages[0] || {}).pageTimings || {}).onContentLoad || null,
          onLoad = ((log.pages[0] || {}).pageTimings || {}).onLoad || 0;

      var globalArr = [], childrenArr = [], csTotalSize = 0, csTotalTime = 0, glTotalTime = 0, glTotalSize = 0, glTotalCookies = 0, csTotalCookies = 0, csTotalSend = 0, csTotalReceive = 0, csTotalWait = 0, csNumOfRequests = 0, glStatusCount = 0, csStatusCount = 0;
      var typeTable = {}, statusTable = {},
          result = entries.map(function(d) {
        //flatten each child (ch)
        var ch = {};
          //packageName
          ch.type = getType(d.response.content.mimeType);
          //className
          ch.name = getEntryName(d.request.url.toString())
          ch.contentSize = formatBytes(d.response.content.size, 2);
          //value
          ch.time = +d.time > 0 ? moment(d.time).valueOf() : 0;
          ch.rawContentSize = +d.response.content.size;
          ch.entrySize = getSize(d.response.status, d.response.headersSize, d.response.bodySize); //total entry size
          //request
          ch.method = d.request.method;
          ch.url = d.request.url;
          //response 
          ch.status = getStatus(d.response.status);
          ch.send = getSend(d.timings.send);
          ch.receive = getReceive(d.timings.receive);
          ch.wait = getWait(d.timings.wait);
          //other timings
          ch.startedTime = new Date(d.startedDateTime).getTime();
          ch.latency = getLatency(d.time, d.timings.receive);
          ch.endTime = getEndTime(d.startedDateTime, d.time);
          ch.reqHeadersCount = +(d.request.headers.length || 0);
          ch.resHeadersCount = +(d.response.headers.length || 0);
          ch.cookies = +(d.request.cookies.length || 0) + +(d.response.cookies.length || 0);
          //others for later
          // ch.nonExpiringCookies = getNonExpiringCookies(d.request.cookies, d.response.cookies);
          // ch.blocked = d.timings.blocked && d.timings.blocked !== -1 ? +d.timings.blocked : 0;
          // ch.dns = d.timings.dns && d.timings.dns !== -1 ? +d.timings.dns : 0;
          // ch.connect = d.timings.connect && d.timings.connect !== -1 ? +d.timings.connect :0;
          // ch.ssl = d.timings.ssl && d.timings.ssl !== -1 ? +d.timings.ssl :0;
          

          //boolean validator on 3rd party requests..response content vs original url vs parsed urls
          // d.response.content.text ? var text = d.response.content.text : ''
          //full url
          // if ()

          // //url without query

          // var urlTest = 

          //url without query and http://





          //url query only













          //count the content-type of each child
          if(!typeTable[ch.type]) {
            typeTable[ch.type] = 1;
          } else {
            typeTable[ch.type]++;
          }
          //count the status type and value of each child
          if(!statusTable[ch.status]) {
            statusTable[ch.status] = 1;
          } else {
            statusTable[ch.status]++;
          }
          //compute global stats
          glTotalSize = glTotalSize + Number(ch.entrySize);
          glTotalTime = glTotalTime + Number(ch.time);
          glTotalCookies = glTotalCookies + Number(ch.cookies);
          glStatusCount = +glStatusCount + getStatusCount(ch.status);

          //create global array
          globalArr.push(ch) 

          //create child object
          var childrenObject = {
            packageName: ch.type,
            className: ch.name,
            classNameCs: ch.contentSize,
            classNameCt: ch.type,
            classNameMs: ch.method + ': ' + ch.status,
            contentSize: ch.contentSize,
            url: ch.url,
            time: formatTime(ch.time),
            latency: formatTime(ch.latency),
            send: ch.send.toFixed(5) + ' ms',
            wait: formatTime(ch.wait),
            receive: formatTime(ch.receive),
            status: ch.status
          }
          //evaluate value
          switch (value) {
            case "time":
              childrenObject.value = ch.time;
              break;
            case "rawContentSize":
              childrenObject.value = ch.rawContentSize;
              break;
            case "send":
              childrenObject.value = ch.send;
              break;
            case "receive":
              childrenObject.value = ch.receive;
              break;
            case "wait":
              childrenObject.value = ch.wait;
              break;
          };
          //determine sizeValue to compute totalSize
          var sizeValue = (ch.entrySize > ch.rawContentSize) ? ch.entrySize : ch.rawContentSize;
          sizeValue = sizeValue > 0 ? sizeValue : 0

          //evaluate content-type
          if (packageName === "all" || packageName === ch.type) {
            //compute chilren stats
            csTotalSize = +csTotalSize + Number(sizeValue);
            csTotalTime = +csTotalTime + Number(ch.time);
            csTotalCookies = +csTotalCookies + Number(ch.cookies);
            csTotalSend = +csTotalSend + Number(ch.send);
            csTotalReceive = +csTotalReceive + Number(ch.receive);
            csTotalWait = +csTotalWait + Number(ch.wait);
            csStatusCount = +csStatusCount + getStatusCount(ch.status);
            if (ch.type === "script" || ch.type === "xhr") {
              csNumOfRequests++;
            };
            //build on children array
            childrenArr.push(childrenObject)
          };
      }); //end of entry map

      var global = {
        name: name,
        date: moment(date).format("YYYY-MM-DD HH:mm Z"),
        requestedPackageName: packageName,
        requestedClassName: className,
        requestedValue: value,
        global: globalArr,
        children: childrenArr,
        globalStats: {
          onLoad: +onLoad > 0 ? formatTime(onLoad) : 'N/A',
          domContentLoaded: +domContentLoaded > 0 ? formatTime(domContentLoaded) : 'N/A',          
          rawOnLoad: +onLoad,
          rawDomContentLoaded: +domContentLoaded,
          totalSize: formatBytes(glTotalSize, 2),
          totalTime: formatTime(glTotalTime),
          avgReqSize: formatBytes(glTotalSize / globalArr.length, 2),
          avgReqTime: formatTime(glTotalTime / globalArr.length),
          totalCookies: glTotalCookies,
          numOfRequests: entries.length,
          numRequestsByOthers: (typeTable.script || 0) + (typeTable.xhr || 0),
          numOfDocuments: +typeTable.document || 0,
          numOfScripts: +typeTable.script || 0,
          numOfXhr: +typeTable.xhr || 0,
          numOfCss: +typeTable.css || 0,
          numOfFont: +typeTable.font || 0,
          numOfImages: +typeTable.image || 0,
          numOfOther: +typeTable.other || 0,
          numOfStatusOtherThan200: glStatusCount,
          statusTable: statusTable,
          nonExpiredHeaders: null
        },
        childrenStats: {
          packageName: packageName,
          totalSize: formatBytes(csTotalSize, 2),
          totalTime: formatTime(csTotalTime),
          avgReqSize: formatBytes(+csTotalSize / +childrenArr.length || 0, 2),
          avgReqTime: formatTime(+csTotalTime / +childrenArr.length || 0),
          percOfGlobalSize: ((csTotalSize / glTotalSize) * 100),
          percOfGlobalTime: ((csTotalTime / glTotalTime) * 100),
          totalCookies: csTotalCookies,
          numOfRequests: childrenArr.length,
          numRequestsByOthers: csNumOfRequests,
          avgSend: formatTime(+csTotalSend / +childrenArr.length || 0),
          avgReceive: formatTime(+csTotalReceive / +childrenArr.length || 0),
          avgWait: formatTime(+csTotalWait / +childrenArr.length || 0),
          numStatusOtherThan200: csStatusCount,
          nonExpiredHeaders: null
        }
      }; //end of global
      return global;
    } //end of extract data function

    function getStatusCount(status) {
      if(status !== 200) return 1;
      return 0;
    }
    function getStatus(status) {
      if (status || status > 0) return +status;
      return "N/A"
    };    
    function getSize(status, hSize, bSize) {
      if (status === 304) return +hSize;
      return Number(hSize) + Number(bSize);
    };    
    function getLatency(time, receive) {
      if (+time > 0 || receive !== undefined) return +time - +receive;
      return 0;
    };
    function getSend(send) {
      if (send !== undefined) return +send;
      return 0;
    };    
    function getReceive(receive) {
      if (receive !== undefined) return +receive;
      return 0;
    };
    function getWait(wait) {
      if (wait !== undefined) return +wait;
      return 0;
    };
    function getEndTime(startedTime, time) {
      if (startedTime && time !== undefined) {
        var startTime = new Date(startedTime).getTime();
        return startTime + Number(time);
      } else {
        return 0;
      }
    };
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
      if(!bytes || bytes === undefined || bytes == 0) return '0 Byte';
      var k = 1000,
          dm = decimals + 1 || 3,
          sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
    }
    function formatTime(milliseconds) {
      var time = new Date(milliseconds),
          duration = time.getUTCSeconds() + "." + time.getUTCMilliseconds() + " ms";
          return duration;
    };
    function getEntryName(str) {
      if(str.lastIndexOf('/') === str.length - 1) str = str.slice(0, str.length - 1);
      var name = (str.substring(str.lastIndexOf('/') + 1, str.length)).trim()
      return name;
    }
    function parseUri (str) {
      var o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

      while (i--) uri[o.key[i]] = m[i] || "";

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    };
    parseUri.options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };
  });
})(); 


//for later

// function getNonExpiringCookies(reqCookies, resCookies) {
//   var count = 0
//   if (reqCookies > 0) {
//       //count non-expiring cookies
//   if (resCookies > 0) {
//       //count non-expiring cookies
//   }
//   return count;
// };
