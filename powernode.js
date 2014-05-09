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
	this.hostname = hostname;
	this.usernane = username;
	this.password = password;
	this.cookie = "";

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
		then(checkSuccess);
};

var requestIndex = function(student) {
	HTTP.request({
		scheme: 'https:',
		method: 'GET',
		host: student.hostname,
		path: '/public/',
		port: 443,
	}).then(parseIndex);
};

var parseIndex = function(response) {
	var body = response.body;

	var pstokenRegex = /<input type="hidden" name="pstoken" value="([a-z0-9]*)" \/>/g;
	var contextDataRegex = /<input type="hidden" name="contextData" value="([A-Z0-9]*)" \/>/g; // AKA pskey

	student.cookie = response.header['Set-Cookie'];
	student.authData.pstoken = body.match(pstokenRegex);
	student.authData.contextData = body.match(contextDataRegex);
};

// Hash important powerschool data
var hashData = function() {

};

// Perform the login request
var requestLogin = function() {
	var hashedPassword = hashPassword(student.password);

	var loginInfo = {
		pstoken: student.pstoken,
		contextData: student.contextData,
		dbpw: '', // TODO: Dafuq is the dbpw...
		translator_username: '',
		translator_password: '',
		translator_ldappassword: '',
		returnUrl: '',
		serviceName: 'PS Parent Portal', // TODO: Am I allowed to change this?
		serviceTicket: '',
		pcasServerUrl: '/',
		credentialType: 'User Id and Password Credential',
		account: student.username,
		pw: hashedPassword,
		translatorpw: '',
		Cookie: student.cookie
	};

	HTTP.request({
		scheme: 'https:',
		method: 'POST',
		host: student.hostname,
		path: '/guardian/home.html',
		port: 443,
		headers: loginInfo
	});
};

var checkSuccess = function() {

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
