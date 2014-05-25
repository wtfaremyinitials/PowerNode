/*
	Packages
 */
var Q      = require('Q');
var xml2js = require('xml2js');
var https  = require('https');

/*
	Generic Methods
*/
var request = function(options, callback) {
	var deferred = Q.defer();

	var request = https.request(options, function(res) {
		var body = '';
		res.on('data', function(data) {
			body = body + data;
		});
		res.on('end', function() {
			deferred.resolve({
				'body': body,
				'cookie': (res.headers['set-cookie'] || '')
			});
		});
	}).on('error', deferred.reject);
	request.end();

	return deferred.promise;
};

var parseXML = Q.denodeify(xml2js.parseString);

/*
	Constants
*/
var userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';

/*
	Exports
*/
module.exports.getStudentData = function(hostname, username, password) {
	var contextData = '';
	var pstoken = '';
	var cookie = '';
	return getIndex(hostname)
    		.then(parseIndex)
			.then(prepareLogin)
			.then(requestLogin)
			.then(downloadXML)
			.then(parseXML)
			.then(convert);
};

/*
	Main
*/

var getIndex = function(hostname) {
	return request({
		'method': 'GET',
		'path': '/public/',
		'hostname': hostname
	});
};

var parseIndex = function(response) {
	var body = response.body;

	var pstokenRegex     = /name="pstoken" value="([a-zA-Z0-9]*)"/g;
    var contextDataRegex = /name="contextData" value="([A-Z0-9]*)"/g; // AKA pskey

    return {
		'pstoken': pstokenRegex.exec(body)[1],
		'contextData': contextDataRegex.exec(body)[1]
	};
};

var prepareLogin = function() {

};

var requestLogin = function() {

};

var downloadXML = function() {

};

var convert = function(studentData) {

};
