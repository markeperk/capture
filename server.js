//Requires
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;

//Server-Side Controllers
var urlHarController = require('./api/Controllers/UrlHarController');
var pastedHarController = require('./api/Controllers/PastedHarController');

//BodyParser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

//Static Files
app.use(express.static(__dirname+'/public'));

//Endpoints
app.post('/api/urlrequest', urlHarController.buildHarFile)
app.post('/api/pasted', pastedHarController.create)

//Port
app.listen(port);
console.log('listening on port ' + port);
exports = module.exports = app;