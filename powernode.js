/*
	Packages
 */
var Q = require('q');
var HTTP = require('q-io/http');

/*
	Constants
*/

// User Agent sent to PowerSchool server
var userAgent = 'powernode/0.0.1 (https://github.com/wtfaremyinitials/powernode)';

/*
	Models
*/
var Student = function(hostname, username, password) {
	this.hostname = "";
	this.cookie   = "";

	this.authData = {
		pstoken: "",
		contextData: ""
	};

};
Student.prototype.getClasses = function() {

};
Student.prototype.getGrades = function() {

};


/*
	Functions
*/
var authenticate = function() {
	requestIndex().
		then(parseIndex).
		then(hashData).
		then(requestLogin).
		then(parseHome);
};

var requestIndex = function(student) {
	HTTP.request({
		scheme: 'https:',
		host: student.hostname,
		path: '/public/home.html',
		port: 443
	}).then(parseIndex);
};

var parseIndex = function(response) {
	var body = response.body;

	var pstokenRegex = /<input type="hidden" name="pstoken" value="([a-z0-9]*)" \/>/g;
	var contextDataRegex = /<input type="hidden" name="contextData" value="([A-Z0-9]*)" \/>/g; // AKA pskey

	student.pstoken = body.match(pstokenRegex);
	student.contextData = body.match(contextDataRegex);
};

// Hash important powerschool data
var hashData = function() {

};

// Perform the login request
var requestLogin = function() {

};

// Parses grades on homepage
var parseHome = function() {

};

var loginStudent = function(hostname, username, password) {
	return Q.fcall(function() {
		var student = new Student(hostname, username, password);
		authenticate(student).then(function() {
			resolve(student);
		});
	});
};

module.exports.loginStudent = loginStudent;
