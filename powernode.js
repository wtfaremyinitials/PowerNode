/*
	Packages
 */
var Q      = require('Q');
var xml2js = require('xml2js');
var https  = require('https');

/*
	Generic Methods
*/
var request = Q.denodify(https.request);
var parseXML = Q.denodify(xml2js.parseString);

/*
	Constants
*/
var userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';

module.exports.getStudentData = function(hostname, username, password) {
	var contextData = '';
	var pstoken = '';
	var cookie = '';
	return getIndex(hostname).then(parseIndex).then(prepareLogin).then(requestLogin).then(downloadXML).then(parseXML).then(convert);
};

var getIndex = function(hostname) {
	
};

var parseIndex = function(response) {

};

var prepareLogin = function() {

};

var requestLogin = function() {

};

var downloadXML = function() {

};

var convert = function(studentData) {

};
