var q = require('q');
var phantom = require('phantom');


module.exports.buildHarFile = function(req, res) {
	var address = req.body.url, harFile = [];
  console.log('ss.address', address)
	phantom.create(function (ph) {
    ph.createPage(function (page) {
    	page.address = address;
	    page.resources = [];
      page.set("onLoadStarted", function (req) {
        page.startTime = new Date();
      });  
      page.set("onResourceRequested", function (req) {
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
      });
	    page.open(page.address, function (status) {
        var har;
        if (status !== 'success') {
          console.log('FAIL to load the address');
          return res.status(200).send(status);
          ph.exit(1);
          ph._phantom.kill('SIGTERM');
        } else {
          page.endTime = new Date();
          page.title = page.evaluate(function () {
              return document.title;
          });
          harFile.push(page);
          return res.status(200).send(harFile);
          ph.exit();
        }
        // return res.status(200).send(harFile);
    	}); //end of page.open
	  }); //end of createpage()  
  });
}; //End of module



























