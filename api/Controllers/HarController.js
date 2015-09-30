var harService = require('./../Services/HarService');

module.exports.pullNetworkData = function(req, res) {
	
	var page = ["http://www.viator.com/about-us"];

	harService.pullNetworkData(page).then(function(response) {
		var data = response;
		res.json(response);



	}, 
	function(err){
		console.log(3333, err)
	});
};

