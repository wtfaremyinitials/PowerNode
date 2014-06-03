/*
	Packages
 */
var Q      = require('q');
var xml2js = require('xml2js');
var https  = require('https');
var toughcookie = require('tough-cookie');
var querystring = require('querystring');
var pscrypto = require('./lib/pscrypto');

/*
	Constants
*/
var userAgent = 'powernode/0.0.0 (https://github.com/wtfaremyinitials/powernode)';

/*
	Generic Methods
*/
var request = function(options, data) {
	var deferred = Q.defer();

	data = querystring.stringify(data || '');

    options.headers = options.headers || {};
    options.headers['user-agent'] = userAgent;

	var request = https.request(options, function(res) {
		var body = '';
		res.on('data', function(data) {
			body = body + data;
		});
		res.on('end', function() {
			deferred.resolve({
				'body': body,
				'cookies': (res.headers['set-cookie'] || '')
			});
		});
	}).on('error', deferred.reject);
	request.end(data);

	return deferred.promise;
};

var setCookies = function(cookies, cookieJar, url) {
    for(var i in cookies) {
        cookieJar.setCookieSync(cookies[i], url);
    }
};

var hashPassword = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, pscrypto.b64_md5(password));
};

var generateDBPW = function(contextData, password) {
    return pscrypto.hex_hmac_md5(contextData, password.toLowerCase());
};

var parseXML = Q.denodeify(xml2js.parseString);

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
		'cookieJar': new toughcookie.CookieJar(),
		'loginData': {},
		'xml': ''
	};

	return getIndex(state)
            .then(parseIndex)
			.then(prepareLogin)
			.then(requestLogin)
			.then(downloadXML)
			.then(parseXML)
			.then(convert)
			.catch(handleError);
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
		setCookies(response.cookies, state.cookieJar, 'https://' + state.hostname + '/public/');
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
		'hostname': state.hostname,
		'headers': {
		    'cookie': state.cookieJar.getCookieStringSync('https://' + state.hostname + '/guardian/home.html')
		}

	}, state.loginData).then(function(response) {
		setCookies(response.cookies, state.cookieJar, 'https://' + state.hostname + '/guardian/home.html');
		return state;
	});
};

var downloadXML = function(state) {
	return request({
		'method': 'GET',
		'path': '/guardian/studentdata.xml',
		'hostname': state.hostname,
		'headers': {
	        'cookie': state.cookieJar.getCookieStringSync('https://' + state.hostname + '/guardian/studentdata.xml')
		}
	}).then(function(response) {
		state.xml = response.body;
		return state;
	});
};

var parseXML = function(state) {

};

var convert = function(state) {

};

var handleError = function(error) {
    console.log(error);
};
