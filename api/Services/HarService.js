var express = require('express');
var request = require('request');
var nodePhantom = require('node-phantom');
var app = express();
var q = require('q');


module.exports.pullNetworkData = function(arr) {

	var promises = arr.map(function(i) {
			var deferred = q.defer(), loc = {}, 
			target = i.trim().replace(/[,]/g, '').replace(/[ ]/g, '-');
			url = target;

			request(url, function(error, response, html) {
				if(!error) {
					console.log(url)
					var counter = 0;
					// var system = require('system');
					// var args = system.args;
					// var url = args[1];
					// var page = require('webpage').create();nodemon
					loc.url = url;
					nodePhantom.create(function(err, phantom) {
							console.log("phantom", phantom)
							phantom.onError = function(msg, trace) {
								var msgStack = [ 'PHANTOM ERROR: ' + msg ];
								if (trace && trace.length) {
									msgStack.push('TRACE:');
									 trace.forEach(function(t) {
							        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
							    });
								}
								console.error(msgStack.join('\n'))
								phantom.exit(1);
							}
							phantom.create(createPage,{phantomPath:require('phantomjs').path});
							// phantom.createPage(function(err, page) {
							function createPage(err, page) {
								page.onResourceReceived = function(response) {
									console.log("content-type: " + response.contentType + " ");
									loc.response = response.contentType;
								};

								// page.onResourceReceived = function(response) {
								// 	if(
								// 		(
								// 			response.contentType === 'image/jpeg' ||
								// 			response.contentType === 'image/png' ||
								// 			response.contentType === 'image/gif' 
								// 			) && response.stage === 'start'
								// 		) {
								// 		console.log( 'LOADED: ' + response.url );
								// 	//increment counter
								// 	counter++;
								// 	}
								// }

								page.onLoadFinished = function() {
									console.log('*---------------------------*');
									console.log('Page loaded');
									// console.log('Page loaded ' + counter + ' images.');

									phantom.exit();
								}

								page.open(url, function(err, status) {
									console.log("url", url)
									if (status !== 'success') {
										console.log('Unable to load the address!')
									}
								});
							};
							

					});
					deferred.resolve(loc)
				} else {
					deferred.reject("it was rejected, dummy")
				}
			})
			return deferred.promise
		}) //End of Map
	return q.all(promises);
} //End of Network Pull
