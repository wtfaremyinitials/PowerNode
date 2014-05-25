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
	var contextData = '';
	var pstoken = '';
	var cookie = '';
	return getIndex(hostname)
    		.then(parseIndex)
			.then(function(data) {
				return Q.fcall(function() {
					return {
						'pstoken': data.pstoken,
						'contextData': data.contextData,
						'username': username,
						'password': password
					};
				});
			})
			.then(prepareLogin)
			.then(function(data) {
				Q.fcall(function(){
					return {
						'options': data,
						'hostname': hostname
					};
				});
			})
			.then(requestLogin)
			.then(downloadXML)
			.then(parseXML)
			.then(convert);
};

/*
	Logic
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

var prepareLogin = function(data) {
	return {
		pstoken: data.pstoken,
        contextData: data.contextData,
        dbpw: generateDBPW(contextData, data.password), // TODO: Dafuq is the dbpw...
        translator_username: '',
        translator_password: '',
        translator_ldappassword: '',
        returnUrl: '',
        serviceName: 'PS Parent Portal', // TODO: Am I allowed to change this?
        serviceTicket: '',
        pcasServerUrl: '/',
        credentialType: 'User Id and Password Credential',
        account: data.username,
        pw: hashPassword(data.contextData, data.password),
        translatorpw: ''
	};
};

var requestLogin = function(data) {
	request({
		'method': 'POST',
		'path': '/guardian/home.html',
		'hostname': data.hostname
	});
};

var downloadXML = function(data) {
	console.log(data.body);
};

var convert = function(studentData) {

};
