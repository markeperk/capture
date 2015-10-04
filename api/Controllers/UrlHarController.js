var harService = require('./../Services/UrlHarService');
var q = require('q');

module.exports.buildHarFile = function(req, res) {
	console.log('ss.urlharcntrl-req.body', req.body)
	var address = req.body.url;
	harService.buildHarFile(address).then(function(urlHarData) {
		res.send(urlHarData);
	}, 
	function(err){
		console.log('ss.urlharctrller', err)
	});
};




//functioning code

// request: function(req, res) {
	// var address = req.body.url;
	// console.log(address)
	// phantom.create(function (ph) {
	//    ph.createPage(function (page) {
	//      page.set("onResourceRequested", function (req) {
	//      	req.url = address;
	//      	console.log('url', req.url);
	//        console.log('requested: ' + JSON.stringify(req, undefined, 4));
	//      });
	//      page.set("onResourceReceived", function (res) {
	//      	res.url = address;
	//      	console.log('res', res.url);
	//        console.log('received: ' + JSON.stringify(res, undefined, 4));
	//      });
	//      page.open(address, function (status) {
	//        if (status !== 'success') {
	//          console.log('FAIL to load the address');
	//        }
	//        ph.exit();
	//      });
	//    });
	// });
// }
