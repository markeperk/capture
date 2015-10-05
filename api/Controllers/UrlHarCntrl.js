var q = require('q');
var phantom = require('phantom');


module.exports.buildHarFile = function(req, res) {
	var address = req.body.url;
	console.log('ss.address', address)

	if (!Date.prototype.toISOString) {
  	Date.prototype.toISOString = function () {
	    function pad(n) { return n < 10 ? '0' + n : n; }
	    function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n }
	    return this.getFullYear() + '-' +
	      pad(this.getMonth() + 1) + '-' +
	      pad(this.getDate()) + 'T' +
	      pad(this.getHours()) + ':' +
	      pad(this.getMinutes()) + ':' +
	      pad(this.getSeconds()) + '.' +
	      ms(this.getMilliseconds()) + 'Z';
		}
	}

	function createHAR(address, title, startTime, resources) {
    var entries = [];
    resources.forEach(function (resource) {
      var request = resource.request,
          startReply = resource.startReply,
          endReply = resource.endReply;

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
        startedDateTime: request.time,
        time: endReply.time - request.time,
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
          bodySize: startReply.bodySize,
          content: {
            size: startReply.bodySize,
            mimeType: endReply.contentType
          }
        },
        cache: {},
        timings: {
          blocked: 0,
          dns: -1,
          connect: -1,
          send: 0,
          wait: startReply.time - request.time,
          receive: endReply.time - startReply.time,
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
          // version: phantom.version.major + '.' + phantom.version.minor + '.' + phantom.version.patch
          version: "phantom"
        },
        pages: [{
          // startedDateTime: startTime.toISOString(),
          startedDateTime: startTime,
          id: address,
          title: title,
          pageTimings: {
            onLoad: page.endTime - page.startTime
          }
        }],
        entries: entries
      }
    };
	} //end of function createHAR

  var harFile = []
	phantom.create(function (ph) {
    ph.createPage(function (page) {
    	page.address = address;
	    page.resources = [];
      page.set("onLoadStarted", function (req) {
        page.startTime = new Date();
      });  
      page.set("onResourceRequested", function (req) {
        // console.log('requested: ' + JSON.stringify(req, undefined, 4));
        page.resources[req.id] = {
          request: req,
          startReply: null,
          endReply: null
        };
      });
      page.set("onResourceReceived", function (res) {
        if (res.stage === 'start') {
          page.resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
          page.resources[res.id].endReply = res;
        }
        // console.log('received: ' + JSON.stringify(res, undefined, 4));
      });
	    page.open(page.address, function (status) {
        var har;
        if (status !== 'success') {
          console.log('FAIL to load the address');
          ph.exit(1);
        } else {
          page.endTime = new Date();
          page.title = page.evaluate(function () {
              return document.title;
          });
          harFile.push(page);
          // harFile.push(createHAR(page.address, page.title, page.startTime, page.endTime, page.resources));
          ph.exit();
        }
        // console.log('harfile', harFile);
        return res.status(200).send(harFile);
    	}); //end of page.open
	  }); //end of createpage()  
  })
} //End of module



























