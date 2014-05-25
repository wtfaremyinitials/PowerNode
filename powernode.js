/*
	Packages
 */
var Q      = require('Q');
var xml2js = require('xml2js');
var https  = require('https');
var pscrypto = require('./lib/pscrypto');

/*
	Generic Methods
*/
var request = function(options, data) {
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
	request.end(JSON.stringify((data || '')));

	return deferred.promise;
};

var hashPassword = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, pscrypto.b64_md5(password));
};

var generateDBPW = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, password.toLowerCase());
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
	var state = {
		'hostname': hostname,
		'username': username,
		'password': password,
		'index': '',
		'pstoken': '',
		'contextData': '',
		'cookie': '',
		'loginData': {}
	};

	return getIndex(state)
    		.then(parseIndex)
			.then(prepareLogin)
			.then(requestLogin)
			.then(downloadXML)
			.then(parseXML)
			.then(convert);
};

/*
	Logic
*/

var getIndex = function(state) {
	return request({
		'method': 'GET',
		'path': '/public/',
		'hostname': state.hostname
	}).then(function(response) {
		state.index = response.body;
		state.cookie = response.cookie;
		return state;
	});
};

var parseIndex = function(state) {
	var body = state.index;

	var pstokenRegex     = /name="pstoken" value="([a-zA-Z0-9]*)"/g;
    var contextDataRegex = /name="contextData" value="([A-Z0-9]*)"/g; // AKA pskey

	state.pstoken = pstokenRegex.exec(body)[1];
	state.contextData = contextDataRegex.exec(body)[1];

    return state;
};

var prepareLogin = function(state) {

	var data = {
		pstoken: state.pstoken,
		contextData: state.contextData,
		dbpw: generateDBPW(state.contextData, state.password), // TODO: Dafuq is the dbpw...
		translator_username: '',
		translator_password: '',
		translator_ldappassword: '',
		returnUrl: '',
		serviceName: 'PS Parent Portal', // TODO: Am I allowed to change this?
		serviceTicket: '',
		pcasServerUrl: '/',
		credentialType: 'User Id and Password Credential',
		account: state.username,
		pw: hashPassword(state.contextData, state.password),
		translatorpw: ''
	};
	state.loginData = data;
	return state;
};

var requestLogin = function(state) {
	return request({
		'method': 'POST',
		'path': '/guardian/home.html',
		'hostname': state.hostname
	}, state.loginData).then(function(response) {
		state.cookie = (response.cookie || state.cookie);
		return state;
	});
};

var downloadXML = function(state) {

};

var convert = function(studentData) {

};
