//Requires
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8081;

//Server-Side Controllers
var harController = require('./api/Controllers/HarController');
var pastedHarController = require('./api/Controllers/PastedHarController');

//BodyParser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

//Static Files
app.use(express.static(__dirname+'/public'));












//Endpoints
// app.get('/api/urlrequest', harController.pullNetworkData)
app.post('/api/urlrequest', pastedHarController.list)
app.post('/api/pasted', pastedHarController.create)







//Port
app.listen(port);
console.log('listening on port ' + port);
exports = module.exports = app;