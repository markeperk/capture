//Requires
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8081;

//Server-Side Controllers
var harController = require('./api/Controllers/HarController');
var pastedHarController = require('./api/Controllers/PastedHarController');

//BodyParser
app.use(bodyParser.json())

//Static Files
app.use(express.static(__dirname+'/public'));












//Endpoints
app.get('/network', harController.pullNetworkData)
app.post('/api/pasted', pastedHarController.create)







//Port
app.listen(port);
console.log('listening on port ' + port);
exports = module.exports = app;