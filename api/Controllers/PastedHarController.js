var WebPageTest = require('webpagetest');


module.exports = {

  create: function(req, res) {
		return res.status(200).send(req.body);
  },
  list: function(req, res) {
  	console.log("reqbodyurl", req.body.url)
  	var url = req.body.url
  	var wpt = new WebPageTest('www.webpagetest.org', '');
  	wpt.getHARData(url, {location: 'ec2-us-west-2:Chrome'}, function callback(err, data) {
		  console.log('hardata', err || data);
		});

		wpt.runTest(url, {location: 'ec2-us-west-2:Chrome'}, function(err, data) {
		  console.log('runtest', err || data);
		});

  }

};