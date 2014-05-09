/*
	Packages
 */
var Q = require('q');
var HTTP = require('q-io/http');
var pscrypto = require('./lib/pscrypto');

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
var authenticate = function(student) {
	requestIndex(student).
		then(parseIndex).
		then(requestLogin).
		then(checkSuccess);
};

var requestIndex = function(student) {
	return HTTP.request({
		scheme: 'https:',
		method: 'GET',
		host: student.hostname,
		path: '/public/home.html',
		port: 443,
	});
};

var parseIndex = function(response) {
	var d = Q.defer();

	var body = response.body;

	var pstokenRegex = /<input type="hidden" name="pstoken" value="([a-z0-9]*)" \/>/g;
	var contextDataRegex = /<input type="hidden" name="contextData" value="([A-Z0-9]*)" \/>/g; // AKA pskey

	student.cookie = response.header['Set-Cookie'];
	student.authData.pstoken = body.match(pstokenRegex);
	student.authData.contextData = body.match(contextDataRegex);

	d.resolve();
	return d;
};

// Perform the login request
var requestLogin = function() {
	var password = student.password;
	var contextData = student.authData.contextData;

	var hashedPassword = hashPassword(contextData, password);
	var dbpw = generateDBPW(contextData, password);

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

	return HTTP.request({
		scheme: 'https:',
		method: 'POST',
		host: student.hostname,
		path: '/guardian/home.html',
		port: 443,
		headers: loginInfo
	});
};

var checkSuccess = function(response) {
	var d = Q.defer();
	if(response.status == 302) {
		// Success! We're being redirected to the homepage
		d.resolve(student);
	} else {
		throw("Login Failed - Rejected");
	}
	return d;
};

var hashPassword = function(contextData, password) {
	return pscrypto.hex_hmac_md5(contextData, pscrypto.b64_md5(password));
};

var generateDBPW = function(contextData, password) {
	return pscrypto.hex_hmac_md5(contextData, password.toLowerCase());
};

var loginStudent = function(hostname, username, password) {
	return Q.fcall(function() {
		var student = new Student(hostname, username, password);
		return authenticate(student);
	});
};

module.exports.loginStudent = loginStudent;
